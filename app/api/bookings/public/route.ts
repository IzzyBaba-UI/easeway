import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import {
  sendAdminBookingNotification,
  sendPatientConfirmationEmail,
} from "../../../../lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      dateOfBirth,
      service,
      serviceCategory, // added
      date,
      time,
      sessionType,
      sessionDuration,
      message,
      emergencyContact,
      medicalHistory,
      currentMedications,
      previousPhysiotherapy,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !service) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For home & virtual visits, date and time are not required (will be TBD)
    const isManualScheduling =
      serviceCategory === "home" ||
      serviceCategory === "virtual" ||
      service === "Home Visit" ||
      service === "Virtual Consultation";
    if (!isManualScheduling && (!date || !time)) {
      return NextResponse.json(
        { error: "Date and time are required for non-home visit bookings" },
        { status: 400 }
      );
    }

    // For manually scheduled (home/virtual), set TBD values
    const bookingDate = isManualScheduling ? "TBD" : date;
    const bookingTime = isManualScheduling ? "TBD" : time;

    // Validate date only for non-manual visits
    if (!isManualScheduling) {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return NextResponse.json(
          { error: "Cannot book appointments for past dates" },
          { status: 400 }
        );
      }

      // Check if the time slot is still available (only for scheduled appointments)
      const existingBooking = await prisma.booking.findFirst({
        where: {
          date,
          time,
          status: {
            in: ["pending", "confirmed"],
          },
        },
      });

      if (existingBooking) {
        return NextResponse.json(
          {
            error:
              ">This time slot is no longer available. Please select a different time.",
          },
          { status: 409 } // Conflict
        );
      }
    }

    // Check if clinic settings allow booking for this time
    const settings = await prisma.clinicSettings.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (settings && !settings.isActive) {
      return NextResponse.json(
        {
          error:
            ">Online booking is currently disabled. Please call +44 7460 091561 to book.",
        },
        { status: 503 } // Service Unavailable
      );
    }

    // Create a guest user or find existing user by email
    let userId = "guest-booking"; // Default for guest bookings

    // Try to find existing user by email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create a guest user record
      const guestUser = await prisma.user.create({
        data: {
          email,
          name,
          role: "client",
        },
      });
      userId = guestUser.id;
    }

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        userId,
        name,
        email,
        phone,
        dateOfBirth: dateOfBirth || null,
        service,
        date: bookingDate,
        time: bookingTime,
        sessionType: sessionType || null,
        sessionDuration: sessionDuration || null,
        message,
        emergencyContact: emergencyContact || null,
        medicalHistory: medicalHistory || null,
        currentMedications: currentMedications || null,
        previousPhysiotherapy: previousPhysiotherapy || null,
        status: "pending",
      },
    });

    const confirmationNumber = booking.id.slice(-8).toUpperCase();

    // Prepare notification data
    const notificationData = {
      name,
      email,
      phone,
      dateOfBirth,
      service,
      serviceCategory,
      date: bookingDate,
      time: bookingTime,
      sessionType,
      sessionDuration,
      message,
      emergencyContact,
      medicalHistory,
      currentMedications,
      previousPhysiotherapy,
      confirmationNumber,
    };

    // Send email notifications (don't block the response if email fails)
    try {
      console.log("Attempting to send email notifications...");
      console.log("RESEND_API_KEY configured:", !!process.env.RESEND_API_KEY);
      console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

      // Send admin notification
      const adminResult = await sendAdminBookingNotification(notificationData);
      console.log("Admin email result:", adminResult);

      // Send patient confirmation
      const patientResult = await sendPatientConfirmationEmail(
        notificationData
      );
      console.log("Patient email result:", patientResult);
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Continue with the response even if email fails
    }

    return NextResponse.json({
      success: true,
      message:
        ">Booking submitted successfully! We'll contact you within 24 hours to confirm your appointment.",
      booking: {
        id: booking.id,
        status: booking.status,
        date: booking.date,
        time: booking.time,
        sessionType: booking.sessionType,
        sessionDuration: booking.sessionDuration,
        service: booking.service,
        confirmationNumber,
      },
    });
  } catch (error) {
    console.error("Error creating public booking:", error);
    return NextResponse.json(
      {
        error:
          ">Internal server error. Please try again or call us directly at +44 7460 091561.",
      },
      { status: 500 }
    );
  }
}
