import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

interface BlockedPeriod {
  start: string;
  end: string;
  reason: string;
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
}

// GET - Fetch current clinic settings
export async function GET() {
  try {
    // Get clinic settings (should have only one record)
    const settings = await prisma.clinicSettings.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    // If no settings exist, create default settings
    if (!settings) {
      const defaultSettings = await prisma.clinicSettings.create({
        data: {
          openingTime: "09:00",
          closingTime: "17:00",
          workingDays: [1, 2, 3, 4, 5], // Monday to Friday
          timeSlotDuration: 30,
          isActive: true,
        },
      });

      return NextResponse.json({
        settings: {
          ...defaultSettings,
          blockedPeriods: defaultSettings.blockedPeriods || [],
          workingDays: defaultSettings.workingDays || [1, 2, 3, 4, 5],
        },
      });
    }

    return NextResponse.json({
      settings: {
        ...settings,
        blockedPeriods: settings.blockedPeriods || [],
        workingDays: settings.workingDays || [1, 2, 3, 4, 5],
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
