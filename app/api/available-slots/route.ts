import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

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

// Helper function to safely parse JSON
function safeParseJSON<T>(val: unknown, fallback: T): T {
  if (val == null) return fallback;
  if (typeof val === "string") {
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  }
  return val as T;
}

// GET - Fetch available time slots for a specific date (public endpoint)
export async function GET(request: NextRequest) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
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

    // Validate date format
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Don't allow booking for past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json({
        availableSlots: [],
        message: "Cannot book appointments for past dates",
      });
    }

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
      return NextResponse.json({
        availableSlots: [],
        message:
          "Clinic settings not configured. Please contact the clinic directly.",
      });
    }

    // Check if clinic is active
    if (!settings.isActive) {
      return NextResponse.json({
        availableSlots: [],
        message:
          "Clinic is currently closed for online bookings. Please call +44 7460 091561.",
      });
    }

    // Get daily schedule from DB or use defaults
    const dailySchedule = safeParseJSON<
      Record<string, { open: string; close: string; enabled: boolean }>
    >(settings.dailySchedule, DEFAULT_DAILY_SCHEDULE);

    const daySchedule = dailySchedule[String(dayOfWeek)];

    // Check if this day is enabled
    if (!daySchedule || !daySchedule.enabled) {
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return NextResponse.json({
        availableSlots: [],
        message: `Clinic is closed on ${dayNames[dayOfWeek]}s`,
      });
    }

    // Use the day's specific schedule
    const openingMinutes = timeToMinutes(daySchedule.open);
    const closingMinutes = timeToMinutes(daySchedule.close);
    const slotDuration = settings.timeSlotDuration;

    const availableSlots: string[] = [];
    const blockedPeriods = safeParseJSON<BlockedPeriod[]>(
      settings.blockedPeriods,
      []
    );

    // Fetch all bookings and blocked slots for the date at once (performance optimization)
    let existingBookings: { time: string }[] = [];
    let blockedSlots: { time: string }[] = [];

    try {
      [existingBookings, blockedSlots] = await Promise.all([
        prisma.booking.findMany({
          where: {
            date: date,
            status: {
              in: ["pending", "confirmed"],
            },
          },
          select: { time: true },
        }),
        prisma.blockedSlot.findMany({
          where: {
            date: date,
          },
          select: { time: true },
        }),
      ]);
    } catch (dbError) {
      console.error("Database error fetching bookings/blocked slots:", dbError);
      // Continue with empty arrays rather than failing completely
      existingBookings = [];
      blockedSlots = [];
    }

    // Create sets for O(1) lookup
    const bookedTimes = new Set(existingBookings.map((b) => b.time));
    const blockedTimes = new Set(blockedSlots.map((b) => b.time));

    // Generate time slots
    for (
      let currentMinutes = openingMinutes;
      currentMinutes + slotDuration <= closingMinutes;
      currentMinutes += slotDuration
    ) {
      const slotStart = currentMinutes;
      const slotEnd = currentMinutes + slotDuration;
      const timeString = minutesToTime(slotStart);

      // Check break period
      let isInBreakTime = false;
      if (settings.breakStart && settings.breakEnd) {
        const breakStart = timeToMinutes(settings.breakStart);
        const breakEnd = timeToMinutes(settings.breakEnd);

        if (slotStart < breakEnd && slotEnd > breakStart) {
          isInBreakTime = true;
        }
      }

      // Check blocked periods from settings
      const isBlocked = isTimeSlotBlocked(slotStart, slotEnd, blockedPeriods);

      // Check if time is booked or blocked (O(1) lookup)
      const isBooked = bookedTimes.has(timeString);
      const isBlockedInDb = blockedTimes.has(timeString);

      // Add slot if it's available
      if (!isInBreakTime && !isBlocked && !isBooked && !isBlockedInDb) {
        availableSlots.push(timeString);
      }
    }

    return NextResponse.json({
      availableSlots,
      clinicInfo: {
        openingTime: daySchedule.open,
        closingTime: daySchedule.close,
        isOpen: true,
      },
    });
  } catch (error) {
    console.error("Error fetching available time slots:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
