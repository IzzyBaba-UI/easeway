import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
// Specify runtime (optional but explicit)
export const runtime = "nodejs";

interface BlockedPeriod {
  start: string;
  end: string;
  reason: string;
}

// Helper function to convert time string to minutes
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Helper function to convert minutes to time string
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

// Helper function to check if a time slot conflicts with blocked periods
function isTimeSlotBlocked(
  slotStart: number,
  slotEnd: number,
  blockedPeriods: BlockedPeriod[]
): boolean {
  for (const blocked of blockedPeriods) {
    const blockedStart = timeToMinutes(blocked.start);
    const blockedEnd = timeToMinutes(blocked.end);

    // Check if slot overlaps with blocked period
    if (slotStart < blockedEnd && slotEnd > blockedStart) {
      return true;
    }
  }
  return false;
}

// Default daily schedule (used when no dailySchedule is saved in DB)
const DEFAULT_DAILY_SCHEDULE: Record<
  string,
  { open: string; close: string; enabled: boolean }
> = {
  "0": { open: "13:00", close: "16:00", enabled: true }, // Sunday
  "1": { open: "19:00", close: "21:00", enabled: true }, // Monday
  "2": { open: "19:00", close: "21:00", enabled: true }, // Tuesday
  "3": { open: "19:00", close: "21:00", enabled: true }, // Wednesday
  "4": { open: "19:00", close: "21:00", enabled: true }, // Thursday
  "5": { open: "19:00", close: "21:00", enabled: true }, // Friday
  "6": { open: "09:00", close: "16:00", enabled: true }, // Saturday
};

// GET - Fetch available time slots for a specific date
export async function GET(request: NextRequest) {
  try {
    // Prevent execution during build time
    if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Parse the date to get day of week (0 = Sunday, 1 = Monday, etc.)
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    // Get clinic settings with error handling
    let settings;
    try {
      settings = await prisma.clinicSettings.findFirst({
        orderBy: { createdAt: "desc" },
      });
    } catch (dbError) {
      console.error("Database error fetching clinic settings:", dbError);
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    if (!settings) {
      return NextResponse.json(
        { error: "Clinic settings not configured" },
        { status: 404 }
      );
    }

    // Check if clinic is active
    if (!settings.isActive) {
      return NextResponse.json({
        availableSlots: [],
        message: "Clinic is currently closed for bookings",
      });
    }

    // Get daily schedule from DB or use defaults
    const dailyScheduleRaw = settings.dailySchedule;
    let dailySchedule: Record<
      string,
      { open: string; close: string; enabled: boolean }
    >;
    if (dailyScheduleRaw && typeof dailyScheduleRaw === "object") {
      dailySchedule = dailyScheduleRaw as typeof dailySchedule;
    } else if (typeof dailyScheduleRaw === "string") {
      try {
        dailySchedule = JSON.parse(dailyScheduleRaw);
      } catch {
        dailySchedule = DEFAULT_DAILY_SCHEDULE;
      }
    } else {
      dailySchedule = DEFAULT_DAILY_SCHEDULE;
    }

    const daySchedule = dailySchedule[String(dayOfWeek)];

    // Check if this day is enabled
    if (!daySchedule || !daySchedule.enabled) {
      return NextResponse.json({
        availableSlots: [],
        message: "Clinic is closed on this day",
      });
    }

    const openingMinutes = timeToMinutes(daySchedule.open);
    const closingMinutes = timeToMinutes(daySchedule.close);
    const slotDuration = settings.timeSlotDuration;

    const availableSlots: string[] = [];
    const blockedPeriods = Array.isArray(settings.blockedPeriods)
      ? (settings.blockedPeriods as unknown as BlockedPeriod[])
      : JSON.parse((settings.blockedPeriods as string) || "[]");

    // Generate time slots
    for (
      let currentMinutes = openingMinutes;
      currentMinutes + slotDuration <= closingMinutes;
      currentMinutes += slotDuration
    ) {
      const slotStart = currentMinutes;
      const slotEnd = currentMinutes + slotDuration;

      // Check break period
      let isInBreakTime = false;
      if (settings.breakStart && settings.breakEnd) {
        const breakStart = timeToMinutes(settings.breakStart);
        const breakEnd = timeToMinutes(settings.breakEnd);

        if (slotStart < breakEnd && slotEnd > breakStart) {
          isInBreakTime = true;
        }
      }

      // Check blocked periods
      const isBlocked = isTimeSlotBlocked(slotStart, slotEnd, blockedPeriods);

      // Check existing bookings for this date and time slot
      let existingBooking;
      try {
        existingBooking = await prisma.booking.findFirst({
          where: {
            date: date,
            time: minutesToTime(slotStart),
            status: {
              in: ["pending", "confirmed"],
            },
          },
        });
      } catch (dbError) {
        console.error("Database error checking existing bookings:", dbError);
        // Continue processing without this check in case of DB error
        existingBooking = null;
      }

      // Add slot if it's available
      if (!isInBreakTime && !isBlocked && !existingBooking) {
        availableSlots.push(minutesToTime(slotStart));
      }
    }

    return NextResponse.json({
      availableSlots,
      settings: {
        openingTime: daySchedule.open,
        closingTime: daySchedule.close,
        timeSlotDuration: settings.timeSlotDuration,
        dailySchedule,
      },
    });
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
