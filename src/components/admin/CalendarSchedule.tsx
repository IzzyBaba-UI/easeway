"use client";

import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Ban,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorState from "../ui/ErrorState";
import { adminFetch } from "../../../lib/adminFetch";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
  sessionType?: string;
  sessionDuration?: number;
  confirmationNumber: string;
}

interface BlockedSlot {
  id?: string;
  date: string;
  time: string;
  reason: string;
  createdAt?: string;
}

interface DaySchedule {
  open: string;
  close: string;
  enabled: boolean;
}

interface ClinicSettings {
  openingTime: string;
  closingTime: string;
  breakStart?: string;
  breakEnd?: string;
  blockedPeriods?: { start: string; end: string; reason: string }[];
  workingDays: number[];
  timeSlotDuration: number;
  isActive: boolean;
  dailySchedule?: Record<string, DaySchedule>;
}

const DEFAULT_DAILY_SCHEDULE: Record<string, DaySchedule> = {
  "0": { open: "13:00", close: "16:00", enabled: true },
  "1": { open: "19:00", close: "21:00", enabled: true },
  "2": { open: "19:00", close: "21:00", enabled: true },
  "3": { open: "19:00", close: "21:00", enabled: true },
  "4": { open: "19:00", close: "21:00", enabled: true },
  "5": { open: "19:00", close: "21:00", enabled: true },
  "6": { open: "09:00", close: "16:00", enabled: true },
};

interface CalendarScheduleProps {
  refreshInterval?: number;
}

const CalendarSchedule: React.FC<CalendarScheduleProps> = ({
  refreshInterval = 30000,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>({
    openingTime: "09:00",
    closingTime: "17:00",
    workingDays: [1, 2, 3, 4, 5],
    timeSlotDuration: 30,
    isActive: true,
  });

  const dailySchedule =
    clinicSettings.dailySchedule || DEFAULT_DAILY_SCHEDULE;

  // Generate time slots for a specific day of week
  const generateTimeSlotsForDay = (dayOfWeek: number) => {
    const schedule = dailySchedule[String(dayOfWeek)];
    if (!schedule || !schedule.enabled) return [];

    const slots: string[] = [];
    const [openHour, openMin] = schedule.open.split(":").map(Number);
    const [closeHour, closeMin] = schedule.close.split(":").map(Number);
    const duration = clinicSettings.timeSlotDuration || 30;

    let currentMinutes = openHour * 60 + openMin;
    const endMinutes = closeHour * 60 + closeMin;

    while (currentMinutes < endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const timeStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

      // Skip break periods
      let inBreak = false;
      if (clinicSettings.breakStart && clinicSettings.breakEnd) {
        const [bsH, bsM] = clinicSettings.breakStart.split(":").map(Number);
        const [beH, beM] = clinicSettings.breakEnd.split(":").map(Number);
        const breakStartMin = bsH * 60 + bsM;
        const breakEndMin = beH * 60 + beM;
        if (currentMinutes >= breakStartMin && currentMinutes < breakEndMin) {
          inBreak = true;
        }
      }

      // Skip blocked periods from settings
      if (clinicSettings.blockedPeriods) {
        for (const period of clinicSettings.blockedPeriods) {
          if (period.start && period.end) {
            const [psH, psM] = period.start.split(":").map(Number);
            const [peH, peM] = period.end.split(":").map(Number);
            const pStartMin = psH * 60 + psM;
            const pEndMin = peH * 60 + peM;
            if (currentMinutes >= pStartMin && currentMinutes < pEndMin) {
              inBreak = true;
              break;
            }
          }
        }
      }

      if (!inBreak) {
        slots.push(timeStr);
      }

      currentMinutes += duration;
    }
    return slots;
  };

  // Get all unique time slots across the displayed days (for week view rows)
  const getAllTimeSlots = (days: Date[]) => {
    const allSlots = new Set<string>();
    for (const day of days) {
      const slots = generateTimeSlotsForDay(day.getDay());
      slots.forEach((s) => allSlots.add(s));
    }
    return Array.from(allSlots).sort();
  };

  // Get days for current week
  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDays = getWeekDays(currentDate);

  const isWorkingDay = (date: Date) => {
    const schedule = dailySchedule[String(date.getDay())];
    return schedule?.enabled ?? false;
  };

  // Check if a time falls within a day's schedule
  const isTimeInDaySchedule = (dayOfWeek: number, time: string) => {
    const schedule = dailySchedule[String(dayOfWeek)];
    if (!schedule || !schedule.enabled) return false;
    const slots = generateTimeSlotsForDay(dayOfWeek);
    return slots.includes(time);
  };

  const fetchClinicSettings = async () => {
    try {
      const response = await adminFetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setClinicSettings({
            ...data.settings,
            dailySchedule:
              data.settings.dailySchedule || DEFAULT_DAILY_SCHEDULE,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching clinic settings:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      setError("");
      const response = await adminFetch("/api/admin/bookings");

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings.");
    }
  };

  const fetchBlockedSlots = async () => {
    try {
      const response = await adminFetch("/api/admin/blocked-slots");

      if (response.ok) {
        const data = await response.json();
        setBlockedSlots(data.blockedSlots || []);
      }
    } catch (err) {
      console.error("Error fetching blocked slots:", err);
    }
  };

  const blockTimeSlot = async (date: string, time: string, reason: string) => {
    try {
      const response = await adminFetch("/api/admin/blocked-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          time,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to block time slot");
      }

      await fetchBlockedSlots();
      setShowBlockModal(false);
      setBlockReason("");
      setSelectedSlot(null);
    } catch (err) {
      console.error("Error blocking time slot:", err);
      setError("Failed to block time slot.");
    }
  };

  const unblockTimeSlot = async (date: string, time: string) => {
    try {
      const response = await adminFetch("/api/admin/blocked-slots", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          time,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to unblock time slot");
      }

      await fetchBlockedSlots();
    } catch (err) {
      console.error("Error unblocking time slot:", err);
      setError("Failed to unblock time slot.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchClinicSettings(),
        fetchBookings(),
        fetchBlockedSlots(),
      ]);
      setLoading(false);
    };

    loadData();

    const interval = setInterval(() => {
      fetchBookings();
      fetchBlockedSlots();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isSlotBlocked = (date: string, time: string) => {
    return blockedSlots.some(
      (slot) => slot.date === date && slot.time === time
    );
  };

  const getBookingForSlot = (date: string, time: string) => {
    return bookings.find(
      (booking) => booking.date === date && booking.time === time
    );
  };

  const getBlockedSlotInfo = (date: string, time: string) => {
    return blockedSlots.find(
      (slot) => slot.date === date && slot.time === time
    );
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleSlotClick = (date: string, time: string) => {
    const booking = getBookingForSlot(date, time);
    const blocked = isSlotBlocked(date, time);

    if (booking) {
      return;
    }

    if (blocked) {
      unblockTimeSlot(date, time);
    } else {
      setSelectedSlot({ date, time });
      setShowBlockModal(true);
    }
  };

  const getSlotColor = (date: string, time: string) => {
    const booking = getBookingForSlot(date, time);
    const blocked = isSlotBlocked(date, time);

    if (booking) {
      switch (booking.status) {
        case "confirmed":
          return "bg-green-100 border-green-300 text-green-800";
        case "pending":
          return "bg-yellow-100 border-yellow-300 text-yellow-800";
        case "cancelled":
          return "bg-red-100 border-red-300 text-red-800";
        case "completed":
          return "bg-blue-100 border-blue-300 text-blue-800";
        default:
          return "bg-blue-100 border-blue-300 text-blue-800";
      }
    }

    if (blocked) {
      return "bg-gray-200 border-gray-400 text-gray-600";
    }

    return "bg-white border-gray-200 text-gray-700 hover:bg-gray-50";
  };

  const TimeSlot = ({ date, time }: { date: string; time: string }) => {
    const booking = getBookingForSlot(date, time);
    const blocked = getBlockedSlotInfo(date, time);
    const isToday = formatDate(new Date()) === date;
    const isPast = new Date(`${date}T${time}`) < new Date();

    return (
      <div
        onClick={() => !isPast && handleSlotClick(date, time)}
        className={`
 p-1.5 border rounded text-xs cursor-pointer transition-all min-h-[50px] relative
 ${getSlotColor(date, time)}
 ${isPast ? "opacity-50 cursor-not-allowed" : ""}
 ${isToday ? "ring-2 ring-blue-300" : ""}
 `}
      >
        <div className="font-medium text-xs">{time}</div>
        {booking && (
          <div className="mt-0.5">
            <div className="font-medium truncate text-xs">{booking.name}</div>
            <div className="text-xs opacity-75 truncate">{booking.service}</div>
          </div>
        )}
        {blocked && (
          <div className="mt-0.5">
            <div className="flex items-center gap-0.5">
              <Ban className="w-2.5 h-2.5" />
              <span className="font-medium text-xs">Blocked</span>
            </div>
            <div className="text-xs opacity-75 truncate">{blocked.reason}</div>
          </div>
        )}
        {!booking && !blocked && !isPast && (
          <div className="text-gray-400 text-xs">Click to block</div>
        )}
      </div>
    );
  };

  const WeekView = () => {
    const allTimeSlots = getAllTimeSlots(weekDays);

    return (
      <div className="grid grid-cols-8 gap-1">
        {/* Time column header */}
        <div className="font-medium text-gray-700 p-1 text-xs">Time</div>

        {/* Day headers */}
        {weekDays.map((day) => {
          const working = isWorkingDay(day);
          const schedule = dailySchedule[String(day.getDay())];
          return (
            <div key={day.toISOString()} className="text-center p-1">
              <div
                className={`font-medium text-xs ${working ? "text-gray-900" : "text-gray-400"}`}
              >
                {formatDateDisplay(day)}
              </div>
              {working && schedule ? (
                <span className="text-xs text-gray-400">
                  {schedule.open}-{schedule.close}
                </span>
              ) : (
                <span className="text-xs text-red-400 font-medium">
                  Closed
                </span>
              )}
            </div>
          );
        })}

        {/* Time slots */}
        {allTimeSlots.map((time) => (
          <React.Fragment key={time}>
            {/* Time label */}
            <div className="p-1 text-xs text-gray-700 border-r">{time}</div>

            {/* Day slots */}
            {weekDays.map((day) => {
              const dateStr = formatDate(day);
              const working = isWorkingDay(day);
              const inSchedule = isTimeInDaySchedule(day.getDay(), time);

              if (!working || !inSchedule) {
                return (
                  <div
                    key={`${dateStr}-${time}`}
                    className="p-1.5 border rounded text-xs bg-gray-100 border-gray-200 text-gray-400 min-h-[50px] flex items-center justify-center"
                  >
                    <span className="text-xs">
                      {!working ? "Closed" : ""}
                    </span>
                  </div>
                );
              }

              return (
                <TimeSlot
                  key={`${dateStr}-${time}`}
                  date={dateStr}
                  time={time}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const DayView = () => {
    const daySlots = generateTimeSlotsForDay(currentDate.getDay());
    const schedule = dailySchedule[String(currentDate.getDay())];

    return (
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-4">
          <h3 className="text-sm font-medium text-gray-900">
            {currentDate.toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          {isWorkingDay(currentDate) && schedule ? (
            <p className="text-xs text-gray-500 mt-1">
              {schedule.open} - {schedule.close}
            </p>
          ) : (
            <p className="text-xs text-red-500 mt-1 font-medium">
              Clinic is closed on this day
            </p>
          )}
        </div>

        {isWorkingDay(currentDate) && daySlots.length > 0 ? (
          <div className="space-y-1.5">
            {daySlots.map((time) => (
              <TimeSlot
                key={time}
                date={formatDate(currentDate)}
                time={time}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <CalendarIcon className="w-10 h-10 mx-auto mb-3" />
            <p className="text-sm">This is a non-working day.</p>
          </div>
        )}
      </div>
    );
  };

  const BlockModal = () => {
    if (!showBlockModal || !selectedSlot) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl max-w-sm w-full"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                Block Time Slot
              </h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-600">
                Block {selectedSlot.time} on {selectedSlot.date}?
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-700 mb-1">
                Reason for blocking
              </label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="e.g., Staff meeting, Holiday"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  blockTimeSlot(
                    selectedSlot.date,
                    selectedSlot.time,
                    blockReason
                  )
                }
                disabled={!blockReason.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Block
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <LoadingSpinner
          size="lg"
          text="Loading schedule and booking data..."
          className="h-64"
        />
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ErrorState
          title="Failed to load schedule"
          message={error}
          onRetry={() => {
            setError("");
            setLoading(true);
            Promise.all([
              fetchClinicSettings(),
              fetchBookings(),
              fetchBlockedSlots(),
            ]).finally(() => {
              setLoading(false);
            });
          }}
          showRetry={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Clinic Inactive Warning */}
      {!clinicSettings.isActive && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            The clinic is currently marked as <strong>inactive</strong>. No new
            bookings can be made by patients.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-gray-900">
            Schedule Management
          </h2>
          <p className="text-xs text-gray-500">
            View bookings and manage availability (
            {clinicSettings.timeSlotDuration}min slots)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                viewMode === "week"
                  ? "bg-[#FF3133] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                viewMode === "day"
                  ? "bg-[#FF3133] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Day
            </button>
          </div>
          <button
            onClick={() => {
              fetchBookings();
              fetchBlockedSlots();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#FF3133] text-white rounded-lg hover:bg-[#e62a2c] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
        <button
          onClick={() =>
            viewMode === "week" ? navigateWeek("prev") : navigateDay("prev")
          }
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-900">
            {viewMode === "week"
              ? `Week of ${formatDateDisplay(weekDays[0])}`
              : formatDateDisplay(currentDate)}
          </h3>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs text-[#FF3133] hover:underline"
          >
            Go to Today
          </button>
        </div>

        <button
          onClick={() =>
            viewMode === "week" ? navigateWeek("next") : navigateDay("next")
          }
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-white p-2.5 rounded-lg shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-xs text-gray-700">Confirmed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span className="text-xs text-gray-700">Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
          <span className="text-xs text-gray-700">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-gray-200 border border-gray-400 rounded"></div>
          <span className="text-xs text-gray-700">Blocked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
          <span className="text-xs text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
          <span className="text-xs text-gray-700">Closed</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-xs">{error}</p>
        </div>
      )}

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-sm p-3 overflow-x-auto">
        {viewMode === "week" ? <WeekView /> : <DayView />}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <CalendarIcon className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-medium text-blue-900 mb-1">
              How to use:
            </h4>
            <ul className="text-xs text-blue-700 space-y-0.5">
              <li>Click on an empty slot to block it</li>
              <li>Click on a blocked slot to unblock</li>
              <li>Past slots cannot be modified</li>
              <li>
                Grey &quot;Closed&quot; columns indicate non-working days
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Block Modal */}
      <BlockModal />
    </div>
  );
};

export default CalendarSchedule;
