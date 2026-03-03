"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  Settings,
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  BookOpen,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import BookingManagement from "../../../src/components/admin/BookingManagement";
import CalendarSchedule from "../../../src/components/admin/CalendarSchedule";
import { useAdminAuth } from "../../../src/contexts/AdminAuthContext";
import AdminLogin from "../../../src/components/admin/AdminLogin";
import { adminFetch } from "../../../lib/adminFetch";

interface BlockedPeriod {
  start: string;
  end: string;
  reason: string;
  days?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat. Empty/undefined = all days
}

interface DaySchedule {
  open: string;
  close: string;
  enabled: boolean;
}

interface ClinicSettings {
  id?: string;
  openingTime: string;
  closingTime: string;
  breakStart?: string;
  breakEnd?: string;
  blockedPeriods: BlockedPeriod[];
  workingDays: number[];
  timeSlotDuration: number;
  isActive: boolean;
  dailySchedule: Record<string, DaySchedule>;
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_DAILY_SCHEDULE: Record<string, DaySchedule> = {
  "0": { open: "13:00", close: "16:00", enabled: true },
  "1": { open: "19:00", close: "21:00", enabled: true },
  "2": { open: "19:00", close: "21:00", enabled: true },
  "3": { open: "19:00", close: "21:00", enabled: true },
  "4": { open: "19:00", close: "21:00", enabled: true },
  "5": { open: "19:00", close: "21:00", enabled: true },
  "6": { open: "09:00", close: "16:00", enabled: true },
};

const AdminDashboard = () => {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<
    "settings" | "bookings" | "schedule"
  >("schedule");
  const [settings, setSettings] = useState<ClinicSettings>({
    openingTime: "09:00",
    closingTime: "21:00",
    breakStart: "",
    breakEnd: "",
    blockedPeriods: [],
    workingDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlotDuration: 30,
    isActive: true,
    dailySchedule: DEFAULT_DAILY_SCHEDULE,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newBlockedPeriod, setNewBlockedPeriod] = useState<BlockedPeriod>({
    start: "",
    end: "",
    reason: "",
    days: [],
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchSettings = async () => {
      try {
        const response = await adminFetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings({
              ...data.settings,
              dailySchedule:
                data.settings.dailySchedule || DEFAULT_DAILY_SCHEDULE,
            });
          }
        } else {
          console.error("Failed to fetch settings");
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3133]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleSaveSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await adminFetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSuccess("Settings saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save settings");
      }
    } catch (err) {
      setError("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDayScheduleChange = (
    dayIndex: number,
    field: keyof DaySchedule,
    value: string | boolean
  ) => {
    setSettings((prev) => {
      const schedule = { ...prev.dailySchedule };
      schedule[String(dayIndex)] = {
        ...schedule[String(dayIndex)],
        [field]: value,
      };
      // Sync workingDays array from enabled days
      const workingDays = Object.entries(schedule)
        .filter(([, s]) => s.enabled)
        .map(([d]) => parseInt(d))
        .sort();
      return { ...prev, dailySchedule: schedule, workingDays };
    });
  };

  const addBlockedPeriod = () => {
    if (
      newBlockedPeriod.start &&
      newBlockedPeriod.end &&
      newBlockedPeriod.reason
    ) {
      setSettings((prev) => ({
        ...prev,
        blockedPeriods: [...prev.blockedPeriods, { ...newBlockedPeriod }],
      }));
      setNewBlockedPeriod({ start: "", end: "", reason: "", days: [] });
    }
  };

  const removeBlockedPeriod = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      blockedPeriods: prev.blockedPeriods.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 admin-page">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-[#FF3133] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <h1 className="text-lg font-semibold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Manage clinic settings and bookings
                </p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-[#FF3133] hover:bg-red-50 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-4 sm:space-x-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "schedule"
                  ? "border-[#FF3133] text-[#FF3133]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Schedule & Calendar</span>
                <span className="sm:hidden">Schedule</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "bookings"
                  ? "border-[#FF3133] text-[#FF3133]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Booking Management</span>
                <span className="sm:hidden">Bookings</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "settings"
                  ? "border-[#FF3133] text-[#FF3133]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Settings className="w-4 h-4" />
                Settings
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {activeTab === "schedule" && <CalendarSchedule />}
        {activeTab === "bookings" && <BookingManagement />}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto">
            {/* Status Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-2.5 mb-4 flex items-center gap-2 text-sm"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-800">{success}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-2.5 mb-4 flex items-center gap-2 text-sm"
              >
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-800">{error}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Daily Schedule */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Daily Schedule
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Set opening and closing times for each day. Toggle days
                  on/off.
                </p>

                <div className="space-y-2">
                  {/* Day order: Mon-Sun */}
                  {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
                    const schedule =
                      settings.dailySchedule[String(dayIndex)] ||
                      DEFAULT_DAILY_SCHEDULE[String(dayIndex)];
                    return (
                      <div
                        key={dayIndex}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
                          schedule.enabled
                            ? "bg-white border-gray-200"
                            : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        <label className="flex items-center gap-2 min-w-[90px]">
                          <input
                            type="checkbox"
                            checked={schedule.enabled}
                            onChange={(e) =>
                              handleDayScheduleChange(
                                dayIndex,
                                "enabled",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-[#FF3133] rounded focus:ring-[#FF3133] focus:ring-2"
                          />
                          <span
                            className={`text-sm font-medium ${
                              schedule.enabled
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {dayNames[dayIndex].slice(0, 3)}
                          </span>
                        </label>

                        {schedule.enabled ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="time"
                              value={schedule.open}
                              onChange={(e) =>
                                handleDayScheduleChange(
                                  dayIndex,
                                  "open",
                                  e.target.value
                                )
                              }
                              className="p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                            />
                            <span className="text-xs text-gray-400">to</span>
                            <input
                              type="time"
                              value={schedule.close}
                              onChange={(e) =>
                                handleDayScheduleChange(
                                  dayIndex,
                                  "close",
                                  e.target.value
                                )
                              }
                              className="p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Closed
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <label className="block text-xs text-gray-700 font-medium mb-1">
                    Time Slot Duration
                  </label>
                  <select
                    value={settings.timeSlotDuration}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        timeSlotDuration: parseInt(e.target.value),
                      }))
                    }
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>

              {/* Blocked Periods */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Blocked Time Periods
                </h3>

                {/* Add New Blocked Period */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">
                    Add Blocked Period
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Start
                      </label>
                      <input
                        type="time"
                        value={newBlockedPeriod.start}
                        onChange={(e) =>
                          setNewBlockedPeriod((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                        className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        End
                      </label>
                      <input
                        type="time"
                        value={newBlockedPeriod.end}
                        onChange={(e) =>
                          setNewBlockedPeriod((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                        className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Reason
                      </label>
                      <input
                        type="text"
                        value={newBlockedPeriod.reason}
                        onChange={(e) =>
                          setNewBlockedPeriod((prev) => ({
                            ...prev,
                            reason: e.target.value,
                          }))
                        }
                        placeholder="e.g., Lunch"
                        className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={addBlockedPeriod}
                        className="w-full bg-[#FF3133] text-white px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#e62a2c] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      Days (leave empty for all days)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {dayNames.map((day, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setNewBlockedPeriod((prev) => {
                              const days = prev.days || [];
                              return {
                                ...prev,
                                days: days.includes(i)
                                  ? days.filter((d) => d !== i)
                                  : [...days, i].sort(),
                              };
                            })
                          }
                          className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                            (newBlockedPeriod.days || []).includes(i)
                              ? "bg-[#FF3133] text-white border-[#FF3133]"
                              : "bg-white text-gray-600 border-gray-300 hover:border-[#FF3133]"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Current Blocked Periods */}
                {settings.blockedPeriods.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">
                      Current Blocked Periods
                    </h4>
                    {settings.blockedPeriods.map((period, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-2 text-sm"
                      >
                        <div>
                          <span className="font-medium text-red-800">
                            {period.start} - {period.end}
                          </span>
                          <span className="text-red-600 ml-2 text-xs">
                            ({period.reason})
                          </span>
                          <span className="text-red-500 ml-2 text-xs">
                            {period.days && period.days.length > 0
                              ? period.days.map((d) => dayNames[d].slice(0, 3)).join(", ")
                              : "All days"}
                          </span>
                        </div>
                        <button
                          onClick={() => removeBlockedPeriod(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clinic Status */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Clinic Status
                </h3>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.isActive}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-[#FF3133] rounded focus:ring-[#FF3133] focus:ring-2"
                  />
                  <span className="text-sm text-gray-900">
                    Clinic is open for bookings
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1.5 ml-6">
                  When disabled, no new appointments can be booked
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-[#FF3133] hover:bg-[#e62a2c] text-white"
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
