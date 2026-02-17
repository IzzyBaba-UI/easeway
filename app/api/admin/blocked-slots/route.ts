import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authenticateAdmin } from "../../../../lib/adminAuth";

export async function GET(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");

    const where: { date?: string } = {};
    if (date) {
      where.date = date;
    }

    const blockedSlots = await prisma.blockedSlot.findMany({
      where,
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return NextResponse.json({
      blockedSlots,
      total: blockedSlots.length,
    });
  } catch (error) {
    console.error("Error fetching blocked slots:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    const { date, time, reason } = body;

    if (!date || !time || !reason) {
      return NextResponse.json(
        { error: "Date, time, and reason are required" },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    if (!/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json(
        { error: "Invalid time format. Use HH:MM" },
        { status: 400 }
      );
    }

    const existingBlock = await prisma.blockedSlot.findFirst({
      where: { date, time },
    });

    if (existingBlock) {
      return NextResponse.json(
        { error: "Time slot is already blocked" },
        { status: 409 }
      );
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        date,
        time,
        status: { in: ["pending", "confirmed"] },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Cannot block a time slot that has an existing booking" },
        { status: 409 }
      );
    }

    const blockedSlot = await prisma.blockedSlot.create({
      data: {
        date,
        time,
        reason: reason.trim(),
        createdBy: "admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Time slot blocked successfully",
      blockedSlot,
    });
  } catch (error) {
    console.error("Error blocking time slot:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json();
    const { date, time, id } = body;

    let where: { id?: string; date?: string; time?: string };

    if (id) {
      where = { id };
    } else if (date && time) {
      where = { date, time };
    } else {
      return NextResponse.json(
        { error: "Either ID or date+time must be provided" },
        { status: 400 }
      );
    }

    const deletedSlot = await prisma.blockedSlot.deleteMany({ where });

    if (deletedSlot.count === 0) {
      return NextResponse.json(
        { error: "Blocked slot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Time slot unblocked successfully",
      deletedCount: deletedSlot.count,
    });
  } catch (error) {
    console.error("Error unblocking time slot:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
