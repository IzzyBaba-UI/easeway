import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authenticateAdmin } from "../../../../lib/adminAuth";
import { sendBookingStatusEmail } from "../../../../lib/email";

export async function GET(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, string>).gte = dateFrom;
      if (dateTo) (where.date as Record<string, string>).lte = dateTo;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.booking.count({ where }),
    ]);

    const bookingsWithConfirmation = bookings.map((booking) => ({
      ...booking,
      confirmationNumber: booking.id.slice(-8).toUpperCase(),
    }));

    return NextResponse.json({
      bookings: bookingsWithConfirmation,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      totalBookings: total,
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    const { bookingId, status, notes } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "Booking ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        ...(notes !== undefined && { notes }),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Send email notification for status changes (non-blocking)
    if (status === "confirmed" || status === "cancelled") {
      sendBookingStatusEmail({
        name: updatedBooking.name,
        email: updatedBooking.email,
        service: updatedBooking.service,
        date: updatedBooking.date,
        time: updatedBooking.time,
        confirmationNumber: updatedBooking.id.slice(-8).toUpperCase(),
        status,
      }).catch((err) =>
        console.error("Failed to send status change email:", err)
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      booking: {
        ...updatedBooking,
        confirmationNumber: updatedBooking.id.slice(-8).toUpperCase(),
      },
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
