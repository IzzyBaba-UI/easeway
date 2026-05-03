"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, AlertCircle } from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorState from "../ui/ErrorState";

interface TimeSlotSelectorProps {
  selectedDate: string;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  sessionDuration?: number;
}

interface AvailableSlotsResponse {
  availableSlots: string[];
  clinicInfo?: {
    openingTime: string;
    closingTime: string;
    isOpen: boolean;
  };
  message?: string;
  error?: string;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
  sessionDuration = 30,
}) => {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [clinicInfo, setClinicInfo] = useState<{
    openingTime: string;
    closingTime: string;
    isOpen: boolean;
  } | null>(null);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      setMessage("");
      setError("");
      return;
    }

    const fetchAvailableSlots = async () => {
      setLoading(true);
      setError("");
      setMessage("");

      try {
        const response = await fetch(
          `/api/available-slots?date=${selectedDate}`
        );
        const data: AvailableSlotsResponse = await response.json();

        if (response.ok) {
          setAvailableSlots(data.availableSlots);
          setClinicInfo(data.clinicInfo || null);

          if (data.message) {
            setMessage(data.message);
          }

          // Clear selected time if it's no longer available
          if (selectedTime && !data.availableSlots.includes(selectedTime)) {
            onTimeSelect("");
          }
        } else {
          setError(data.error || "Failed to fetch available time slots");
          setAvailableSlots([]);
        }
      } catch (err) {
        setError("Error fetching available time slots");
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, onTimeSelect, selectedTime]);

  // Generate display time with AM/PM
  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Generate time groups for better organization
  const getTimeGroups = () => {
    if (!clinicInfo) return { morning: [], afternoon: [], evening: [] };

    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];

    availableSlots.forEach((slot) => {
      const [hours] = slot.split(":").map(Number);
      if (hours < 12) {
        morning.push(slot);
      } else if (hours < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { morning, afternoon, evening };
  };

  const { morning, afternoon, evening } = getTimeGroups();

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <label className="block text-[#0E2127] font-medium mb-2">
          Available Time Slots *
        </label>
        <LoadingSpinner
          size="md"
          text="Loading available times..."
          className="p-8"
        />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <label className="block text-[#0E2127] font-medium mb-2">
          Available Time Slots *
        </label>
        <ErrorState
          title="Unable to load time slots"
          message={error}
          onRetry={() => {
            setError("");
            if (selectedDate) {
              // Trigger refetch by updating the dependency
              const fetchAvailableSlots = async () => {
                setLoading(true);
                setError("");
                setMessage("");

                try {
                  const response = await fetch(
                    `/api/available-slots?date=${selectedDate}`
                  );
                  const data: AvailableSlotsResponse = await response.json();

                  if (response.ok) {
                    setAvailableSlots(data.availableSlots);
                    setClinicInfo(data.clinicInfo || null);

                    if (data.message) {
                      setMessage(data.message);
                    }

                    if (
                      selectedTime &&
                      !data.availableSlots.includes(selectedTime)
                    ) {
                      onTimeSelect("");
                    }
                  } else {
                    setError(
                      data.error || "Failed to fetch available time slots"
                    );
                    setAvailableSlots([]);
                  }
                } catch (err) {
                  setError("Error fetching available time slots");
                  setAvailableSlots([]);
                } finally {
                  setLoading(false);
                }
              };
              fetchAvailableSlots();
            }
          }}
          showRetry={true}
          className="py-4"
        />
      </div>
    );
  }

  // Show message when no date selected
  if (!selectedDate) {
    return (
      <div className="space-y-4">
        <label className="block text-[#0E2127] font-medium mb-2">
          Available Time Slots *
        </label>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-body font-uber">
            Please select a date first to view available time slots
          </p>
        </div>
      </div>
    );
  }

  // Show message when no slots available
  if (availableSlots.length === 0) {
    return (
      <div className="space-y-4">
        <label className="block text-[#0E2127] font-medium mb-2">
          Available Time Slots *
        </label>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-yellow-800 font-medium text-body font-uber">
            No available time slots
          </p>
          {message && (
            <p className="text-yellow-700 text-body mt-1 font-uber">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  const renderTimeGroup = (slots: string[], title: string) => {
    if (slots.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-body-sm font-axiforma text-gray-700 mb-2">
          {title}
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot;

            return (
              <motion.button
                key={slot}
                type="button"
                onClick={() => onTimeSelect(slot)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-3 rounded-lg border-2 transition-all duration-200 text-body-sm font-axiforma ${
                  isSelected
                    ? "border-[#FF3133] bg-[#FF3133] text-white shadow-lg"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#FF3133]/50 hover:bg-[#FF3133]/5"
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{slot}</div>
                  <div className="text-[16px] sm:text-[18px] opacity-75 mt-1">
                    {formatTimeDisplay(slot)}
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-[#FF3133] rounded-full"></div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <label className="block text-[#0E2127] font-medium mb-2">
        Available Time Slots *
      </label>

      {/* Clinic Info */}
      {clinicInfo && (
        <div className="text-body-sm text-gray-600 font-uber mb-4">
          <p>
            Clinic hours: {formatTimeDisplay(clinicInfo.openingTime)} -{""}
            {formatTimeDisplay(clinicInfo.closingTime)}
          </p>
          <p className="text-body text-gray-500 mt-1 font-uber">
            Session duration: {sessionDuration} minutes
          </p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        {/* Time Groups */}
        {renderTimeGroup(morning, "Morning")}
        {renderTimeGroup(afternoon, "Afternoon")}
        {renderTimeGroup(evening, "Evening")}

        {/* Selected Time Display */}
        {selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-[#FF3133]/10 border border-[#FF3133]/20 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF3133]" />
              <span className="text-[#FF3133] font-medium text-[16px] sm:text-[18px]">
                Selected: {selectedTime} ({formatTimeDisplay(selectedTime)})
              </span>
            </div>
          </motion.div>
        )}

        {/* Additional Info */}
        <div className="mt-4 text-[16px] sm:text-[18px] text-gray-500">
          <p>• Time slots are based on current clinic availability</p>
          <p>• Blocked times and existing appointments are excluded</p>
          <p>• All times are displayed in local time</p>
          {availableSlots.length > 0 && (
            <p className="text-[#FF3133] font-medium mt-2 text-body font-uber">
              ✓ {availableSlots.length} available slot
              {availableSlots.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
