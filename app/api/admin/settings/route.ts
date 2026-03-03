import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authenticateAdmin } from "../../../../lib/adminAuth";

interface BlockedPeriod {
  start: string;
  end: string;
  reason: string;
}

interface DaySchedule {
  open: string;
  close: string;
  enabled: boolean;
}

interface ClinicSettingsData {
  openingTime: string;
  closingTime: string;
  breakStart?: string;
  breakEnd?: string;
  blockedPeriods: BlockedPeriod[];
  workingDays: number[];
  timeSlotDuration: number;
  isActive: boolean;
  dailySchedule?: Record<string, DaySchedule>;
}

// GET - Fetch current clinic settings
export async function GET(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    // Get clinic settings (should have only one record)
    const settings = await prisma.clinicSettings.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    const DEFAULT_DAILY_SCHEDULE: Record<string, DaySchedule> = {
      "0": { open: "13:00", close: "16:00", enabled: true },
      "1": { open: "19:00", close: "21:00", enabled: true },
      "2": { open: "19:00", close: "21:00", enabled: true },
      "3": { open: "19:00", close: "21:00", enabled: true },
      "4": { open: "19:00", close: "21:00", enabled: true },
      "5": { open: "19:00", close: "21:00", enabled: true },
      "6": { open: "09:00", close: "16:00", enabled: true },
    };

    // If no settings exist, create default settings
    if (!settings) {
      const defaultSettings = await prisma.clinicSettings.create({
        data: {
          openingTime: "09:00",
          closingTime: "21:00",
          workingDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlotDuration: 30,
          isActive: true,
          dailySchedule: DEFAULT_DAILY_SCHEDULE as never,
        },
      });

      return NextResponse.json({
        settings: {
          ...defaultSettings,
          blockedPeriods: defaultSettings.blockedPeriods || [],
          workingDays: defaultSettings.workingDays || [0, 1, 2, 3, 4, 5, 6],
          dailySchedule: defaultSettings.dailySchedule || DEFAULT_DAILY_SCHEDULE,
        },
      });
    }

    return NextResponse.json({
      settings: {
        ...settings,
        blockedPeriods: settings.blockedPeriods || [],
        workingDays: settings.workingDays || [0, 1, 2, 3, 4, 5, 6],
        dailySchedule: settings.dailySchedule || DEFAULT_DAILY_SCHEDULE,
      },
    });
  } catch (error) {
    console.error("Error fetching clinic settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Update clinic settings
export async function POST(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body: ClinicSettingsData = await request.json();
    const {
      openingTime,
      closingTime,
      breakStart,
      breakEnd,
      blockedPeriods,
      workingDays,
      timeSlotDuration,
      isActive,
      dailySchedule,
    } = body;

    // Validate required fields
    if (!openingTime || !closingTime || !workingDays || !timeSlotDuration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(openingTime) || !timePattern.test(closingTime)) {
      return NextResponse.json(
        { error: "Invalid time format. Use HH:MM format." },
        { status: 400 }
      );
    }

    // Validate that opening time is before closing time
    const [openHour, openMin] = openingTime.split(":").map(Number);
    const [closeHour, closeMin] = closingTime.split(":").map(Number);
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    if (openMinutes >= closeMinutes) {
      return NextResponse.json(
        { error: "Opening time must be before closing time" },
        { status: 400 }
      );
    }

    // Validate break times if provided
    if (breakStart && breakEnd) {
      if (!timePattern.test(breakStart) || !timePattern.test(breakEnd)) {
        return NextResponse.json(
          { error: "Invalid break time format. Use HH:MM format." },
          { status: 400 }
        );
      }

      const [breakStartHour, breakStartMin] = breakStart.split(":").map(Number);
      const [breakEndHour, breakEndMin] = breakEnd.split(":").map(Number);
      const breakStartMinutes = breakStartHour * 60 + breakStartMin;
      const breakEndMinutes = breakEndHour * 60 + breakEndMin;

      if (breakStartMinutes >= breakEndMinutes) {
        return NextResponse.json(
          { error: "Break start time must be before break end time" },
          { status: 400 }
        );
      }

      // Validate break times are within opening hours
      if (breakStartMinutes < openMinutes || breakEndMinutes > closeMinutes) {
        return NextResponse.json(
          { error: "Break times must be within opening hours" },
          { status: 400 }
        );
      }
    }

    // Validate blocked periods
    if (blockedPeriods && blockedPeriods.length > 0) {
      for (const period of blockedPeriods) {
        if (!timePattern.test(period.start) || !timePattern.test(period.end)) {
          return NextResponse.json(
            { error: "Invalid blocked period time format. Use HH:MM format." },
            { status: 400 }
          );
        }

        const [startHour, startMin] = period.start.split(":").map(Number);
        const [endHour, endMin] = period.end.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        if (startMinutes >= endMinutes) {
          return NextResponse.json(
            { error: "Blocked period start time must be before end time" },
            { status: 400 }
          );
        }
      }
    }

    // Validate working days
    if (
      !Array.isArray(workingDays) ||
      workingDays.some((day) => day < 0 || day > 6)
    ) {
      return NextResponse.json(
        { error: "Invalid working days. Must be array of numbers 0-6." },
        { status: 400 }
      );
    }

    // Validate dailySchedule if provided
    if (dailySchedule) {
      const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      for (const [day, schedule] of Object.entries(dailySchedule)) {
        const dayNum = parseInt(day);
        if (isNaN(dayNum) || dayNum < 0 || dayNum > 6) {
          return NextResponse.json(
            { error: `Invalid day number: ${day}` },
            { status: 400 }
          );
        }
        if (schedule.enabled) {
          if (
            !timePattern.test(schedule.open) ||
            !timePattern.test(schedule.close)
          ) {
            return NextResponse.json(
              { error: `Invalid time format for day ${day}. Use HH:MM.` },
              { status: 400 }
            );
          }
          const [oh, om] = schedule.open.split(":").map(Number);
          const [ch, cm] = schedule.close.split(":").map(Number);
          if (oh * 60 + om >= ch * 60 + cm) {
            return NextResponse.json(
              {
                error: `Opening time must be before closing time for day ${day}.`,
              },
              { status: 400 }
            );
          }
        }
      }
    }

    // Check if settings already exist
    const existingSettings = await prisma.clinicSettings.findFirst();

    if (existingSettings) {
      // Update existing settings
      const updatedSettings = await prisma.clinicSettings.update({
        where: { id: existingSettings.id },
        data: {
          openingTime,
          closingTime,
          breakStart: breakStart || null,
          breakEnd: breakEnd || null,
          blockedPeriods: (blockedPeriods || []) as never,
          workingDays,
          timeSlotDuration,
          isActive,
          ...(dailySchedule
            ? { dailySchedule: dailySchedule as never }
            : {}),
        },
      });

      return NextResponse.json({
        success: true,
        settings: updatedSettings,
        message: "Clinic settings updated successfully",
      });
    } else {
      // Create new settings
      const newSettings = await prisma.clinicSettings.create({
        data: {
          openingTime,
          closingTime,
          breakStart: breakStart || null,
          breakEnd: breakEnd || null,
          blockedPeriods: (blockedPeriods || []) as never,
          workingDays,
          timeSlotDuration,
          isActive,
          ...(dailySchedule
            ? { dailySchedule: dailySchedule as never }
            : {}),
        },
      });

      return NextResponse.json({
        success: true,
        settings: newSettings,
        message: "Clinic settings created successfully",
      });
    }
  } catch (error) {
    console.error("Error updating clinic settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
