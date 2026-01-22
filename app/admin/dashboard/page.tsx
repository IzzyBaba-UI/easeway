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
} from "lucide-react";
import Link from "next/link";
import BookingManagement from "../../../src/components/admin/BookingManagement";
import CalendarSchedule from "../../../src/components/admin/CalendarSchedule";

interface BlockedPeriod {
  start: string;
  end: string;
  reason: string;
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<
    "settings" | "bookings" | "schedule"
  >("schedule");
  const [settings, setSettings] = useState<ClinicSettings>({
    openingTime: "09:00",
    closingTime: "17:00",
    breakStart: "",
    breakEnd: "",
    blockedPeriods: [],
    workingDays: [1, 2, 3, 4, 5],
    timeSlotDuration: 30,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newBlockedPeriod, setNewBlockedPeriod] = useState<BlockedPeriod>({
    start: "",
    end: "",
    reason: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings(data.settings);
          }
        } else {
          console.error("Failed to fetch settings");
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/settings", {
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

  const handleWorkingDayToggle = (dayIndex: number) => {
    setSettings((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(dayIndex)
        ? prev.workingDays.filter((day) => day !== dayIndex)
        : [...prev.workingDays, dayIndex].sort(),
    }));
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
      setNewBlockedPeriod({ start: "", end: "", reason: "" });
    }
  };

  const removeBlockedPeriod = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      blockedPeriods: prev.blockedPeriods.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDF2F6] to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-[#0E2127] hover:text-[#FF3133] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-[#0E2127]">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-body font-uber">
                Manage clinic settings and bookings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`py-4 px-1 border-b-2 font-medium text-base transition-colors ${
                activeTab === "schedule"
                  ? "border-[#FF3133] text-[#FF3133]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule & Calendar
              </div>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-4 px-1 border-b-2 font-medium text-base transition-colors ${
                activeTab === "bookings"
                  ? "border-[#FF3133] text-[#FF3133]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Booking Management
              </div>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-1 border-b-2 font-medium text-base transition-colors ${
                activeTab === "settings"
                  ? "border-[#FF3133] text-[#FF3133]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Clinic Settings
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {activeTab === "schedule" && <CalendarSchedule />}
        {activeTab === "bookings" && <BookingManagement />}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto">
            {/* Status Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">{success}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Basic Hours Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-body-lg font-semibold text-[#0E2127] mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Operating Hours
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#0E2127] font-medium mb-2">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      value={settings.openingTime}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          openingTime: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0E2127] font-medium mb-2">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      value={settings.closingTime}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          closingTime: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[#0E2127] font-medium mb-2">
                    Time Slot Duration (minutes)
                  </label>
                  <select
                    value={settings.timeSlotDuration}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        timeSlotDuration: parseInt(e.target.value),
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>

              {/* Break Period */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-body-lg font-semibold text-[#0E2127] mb-4">
                  Break Period (Optional)
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#0E2127] font-medium mb-2">
                      Break Start Time
                    </label>
                    <input
                      type="time"
                      value={settings.breakStart || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          breakStart: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0E2127] font-medium mb-2">
                      Break End Time
                    </label>
                    <input
                      type="time"
                      value={settings.breakEnd || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          breakEnd: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Working Days */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-body-lg font-semibold text-[#0E2127] mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Working Days
                </h3>

                <div className="grid grid-cols-7 gap-2">
                  {dayNames.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => handleWorkingDayToggle(index)}
                      className={`p-3 rounded-lg text-base font-medium transition-all ${
                        settings.workingDays.includes(index)
                          ? "bg-[#FF3133] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blocked Periods */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-body-lg font-semibold text-[#0E2127] mb-4">
                  Blocked Time Periods
                </h3>

                {/* Add New Blocked Period */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-[#0E2127] mb-3">
                    Add Blocked Period
                  </h4>
                  <div className="grid md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">
                        Start Time
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
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">
                        End Time
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
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">
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
                        placeholder="e.g., Lunch break"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={addBlockedPeriod}
                        className="w-full bg-[#FF3133] text-white p-2 rounded-lg hover:bg-[#e62a2c] transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Current Blocked Periods */}
                {settings.blockedPeriods.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-[#0E2127] mb-2">
                      Current Blocked Periods
                    </h4>
                    {settings.blockedPeriods.map((period, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3"
                      >
                        <div>
                          <span className="font-medium text-red-800">
                            {period.start} - {period.end}
                          </span>
                          <span className="text-red-600 ml-2">
                            ({period.reason})
                          </span>
                        </div>
                        <button
                          onClick={() => removeBlockedPeriod(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clinic Status */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-body-lg font-semibold text-[#0E2127] mb-4">
                  Clinic Status
                </h3>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.isActive}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-[#FF3133] rounded focus:ring-[#FF3133] focus:ring-2"
                  />
                  <span className="text-[#0E2127] font-medium">
                    Clinic is open for bookings
                  </span>
                </label>
                <p className="text-body text-gray-600 mt-2 font-uber">
                  When disabled, no new appointments can be booked
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
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
