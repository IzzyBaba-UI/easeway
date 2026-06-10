"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  User,
  ArrowRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { BookingProvider, useBooking } from "../../src/contexts/BookingContext";
import ServiceTypeSelection from "../../src/components/booking/ServiceTypeSelection";
import SessionTypeSelection, {
  SessionType,
} from "../../src/components/booking/SessionTypeSelectionNew";
import TimeSlotSelector from "../../src/components/booking/TimeSlotSelector";
import ProgressStepper from "../../src/components/ui/ProgressStepper";
import { useToast } from "../../src/contexts/ToastContext";
import HomeVisitBookingForm from "../../src/components/booking/HomeVisitBookingForm";
import Footer from "@/components/shared/Footer";

const validServiceCategories = [
  "clinic",
  "home",
  "virtual",
  "sports",
  "acupuncture",
] as const;

// Main booking page component
const BookingPage = () => {
  const { bookingData, updateBookingData, currentStep, setCurrentStep } =
    useBooking();
  const { showSuccess, showError, showWarning } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [bookingResponse, setBookingResponse] = useState<{
    success?: boolean;
    message?: string;
    booking?: {
      id: string;
      status: string;
      date: string;
      time: string;
      sessionType?: string;
      sessionDuration?: number;
      service: string;
      confirmationNumber: string;
    };
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showHomeVisitForm, setShowHomeVisitForm] = useState(false); // used for both home & virtual
  const [virtualMode, setVirtualMode] = useState(false); // distinguish which variant is active

  const finalStep = 4;
  const stepTitles = [
    "Service",
    "Session",
    "Personal",
    "Appointment",
    "Review",
  ];
  const hasAppliedInitialService = useRef(false);

  // Handle service category selection with home visit check
  const handleServiceTypeSelect = useCallback(
    (serviceKey: string) => {
      updateBookingData({
        serviceCategory: serviceKey as
          | "clinic"
          | "home"
          | "virtual"
          | "sports"
          | "acupuncture",
      });

      if (serviceKey === "home" || serviceKey === "virtual") {
        setVirtualMode(serviceKey === "virtual");
        setShowHomeVisitForm(true);
      } else {
        setShowHomeVisitForm(false);
        setVirtualMode(false);
      }
    },
    [updateBookingData]
  );

  useEffect(() => {
    if (hasAppliedInitialService.current) {
      return;
    }

    const requestedService = new URLSearchParams(window.location.search).get(
      "service"
    );

    if (
      !requestedService ||
      !validServiceCategories.includes(
        requestedService as (typeof validServiceCategories)[number]
      )
    ) {
      hasAppliedInitialService.current = true;
      return;
    }

    handleServiceTypeSelect(requestedService);

    if (requestedService !== "home" && requestedService !== "virtual") {
      setCurrentStep(1);
    }

    hasAppliedInitialService.current = true;
  }, [handleServiceTypeSelect, setCurrentStep]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    updateBookingData({ [name]: value });

    // Clear form error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = () => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Service Selection
        if (!bookingData.serviceCategory) {
          errors.serviceCategory = "Please select a service type";
        }
        break;
      case 1: // Session Type
        if (!bookingData.sessionType) {
          errors.sessionType = "Please select a session type";
        }
        break;
      case 2: // Personal Info
        if (!bookingData.name.trim()) {
          errors.name = "Full name is required";
        }
        if (!bookingData.email.trim()) {
          errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(bookingData.email)) {
          errors.email = "Please enter a valid email address";
        }
        if (!bookingData.phone.trim()) {
          errors.phone = "Phone number is required";
        }
        if (!bookingData.dateOfBirth) {
          errors.dateOfBirth = "Date of birth is required";
        }
        if (!bookingData.howCanWeHelp.trim()) {
          errors.howCanWeHelp = "Please describe how we can help you";
        } else {
          const wordCount = bookingData.howCanWeHelp
            .split(" ")
            .filter((word) => word.length > 0).length;
          if (wordCount > 100) {
            errors.howCanWeHelp =
              "Please limit your description to 100 words or less";
          }
        }
        if (!bookingData.howCanWeHelp.trim()) {
          errors.howCanWeHelp = "Please describe how we can help you";
        } else {
          const wordCount = bookingData.howCanWeHelp
            .split(" ")
            .filter((word) => word.length > 0).length;
          if (wordCount > 100) {
            errors.howCanWeHelp =
              "Please limit your description to 100 words or less";
          }
        }
        break;
      case 3: // Appointment Details
        if (!bookingData.date) {
          errors.date = "Please select a date";
        }
        if (!bookingData.time) {
          errors.time = "Please select a time slot";
        }
        break;
      case 4: // Review - Final validation
        const allRequiredFields = {
          serviceCategory: "Service type",
          sessionType: "Session type",
          name: "Full name",
          email: "Email address",
          phone: "Phone number",
          howCanWeHelp: "How can we help description",
          date: "Date",
          time: "Time",
        } as const;
        Object.entries(allRequiredFields).forEach(([field, label]) => {
          // @ts-expect-error - Dynamic property access on bookingData
          if (!bookingData[field]) {
            errors[field] = `${label} is required`;
          }
        });
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSessionSelect = (session: SessionType) => {
    console.log("Session selected:", session);
    updateBookingData({ sessionType: session });
  };

  const handleTimeSelect = (time: string) => {
    updateBookingData({ time });
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0:
        return !!bookingData.serviceCategory;
      case 1:
        return bookingData.sessionType !== null;
      case 2:
        return bookingData.name && bookingData.email && bookingData.phone && bookingData.dateOfBirth;
      case 3:
        return bookingData.date && bookingData.time;
      case 4:
        return true; // review step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < finalStep) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      showWarning(
        "Please fill in all required fields",
        "Check the highlighted fields and try again."
      );
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setFormErrors({}); // Clear errors when going back
    }
  };

  // Helper function to get service name based on category
  const getServiceName = (serviceCategory: string) => {
    switch (serviceCategory) {
      case "home":
        return "Home Visit";
      case "virtual":
        return "Virtual Consultation";
      case "clinic":
        return "Clinic Consultation";
      case "sports":
        return "Sports Massage";
      case "acupuncture":
        return "Acupuncture";
      default:
        return "General Consultation";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted! Current step:", currentStep);
    console.log("Booking data:", bookingData);

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Prepare booking data
      const bookingPayload = {
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        dateOfBirth: bookingData.dateOfBirth,
        serviceCategory: bookingData.serviceCategory,
        service: getServiceName(bookingData.serviceCategory),
        date: bookingData.date,
        time: bookingData.time,
        sessionType: bookingData.sessionType?.id || null,
        sessionDuration: bookingData.sessionType?.duration || null,
        message: bookingData.message,
        howCanWeHelp: bookingData.howCanWeHelp,
        emergencyContact: bookingData.emergencyContact,
        medicalHistory: bookingData.medicalHistory,
        currentMedications: bookingData.currentMedications,
        previousPhysiotherapy: bookingData.previousPhysiotherapy,
      };

      const response = await fetch("/api/bookings/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setBookingResponse(data);
        setErrorMessage("");

        showSuccess(
          "Booking confirmed successfully!",
          `Your appointment for ${getServiceName(
            bookingData.serviceCategory
          )} on ${bookingData.date} at ${bookingData.time} has been booked.`
        );

        // Reset form after successful submission
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      } else {
        console.error("Booking submission failed:", data);
        setSubmitStatus("error");
        const errorMsg =
          data.error || "Failed to submit booking. Please try again.";
        setErrorMessage(errorMsg);

        // Show specific error message if time slot is no longer available
        if (response.status === 409) {
          showError(
            "Time slot no longer available",
            "This time slot has been taken by another patient. The page will refresh to show updated availability."
          );
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          showError("Booking failed", errorMsg);
        }
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitStatus("error");
      const errorMsg =
        "Network error. Please check your connection and try again.";
      setErrorMessage(errorMsg);
      showError("Connection error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const handleBackFromHomeVisit = () => {
    setShowHomeVisitForm(false);
    setVirtualMode(false);
    updateBookingData({ serviceCategory: "" });
  };

  // If home visit form should be shown, render it instead
  if (showHomeVisitForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="border-b border-gray-100 bg-white">
          <div className="site-container py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                href="/"
                className="group flex items-center gap-3 text-[16px] font-semibold text-[#0E2127] transition-colors hover:text-[#FF3133]"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>

              <div className="sm:text-right">
                <h3 className="mb-1 font-axiforma text-[24px] text-[#0E2127]">
                  {virtualMode
                    ? "Book Virtual Consultation"
                    : "Book Home Visit"}
                </h3>
                <p className="font-uber text-[16px] text-gray-600">
                  {virtualMode
                    ? "We'll contact you to arrange your video consultation"
                    : "We'll arrange a convenient time for your home visit"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="site-container py-6 lg:py-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-4 sm:p-6 lg:p-8">
              <HomeVisitBookingForm
                onBack={handleBackFromHomeVisit}
                // pass a flag so form can tag submission as virtual
                isVirtual={virtualMode}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ServiceTypeSelection
            selectedService={bookingData.serviceCategory}
            onServiceTypeSelect={handleServiceTypeSelect}
          />
        );
      case 1:
        return (
          <SessionTypeSelection
            selectedSession={bookingData.sessionType}
            onSessionSelect={handleSessionSelect}
            serviceCategory={bookingData.serviceCategory}
          />
        );
      case 2:
        // Personal Information (was case 1)
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF3133]/10">
                <User className="w-5 h-5 text-[#FF3133]" />
              </div>
              <h3 className="font-axiforma text-[24px] text-[#0E2127]">
                Personal Information
              </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-6">
                <div>
                  <label className="block text-[#0E2127] font-medium mb-3 text-[16px] sm:text-[18px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={bookingData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-[16px] sm:text-[18px] ${
                      formErrors.name
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-gray-300 focus:ring-[#FF3133] hover:border-gray-400"
                    }`}
                    placeholder="Your full name"
                  />
                  {formErrors.name && (
                    <p className="mt-2 text-[16px] sm:text-[18px] text-red-600 flex items-center gap-1 font-uber">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[#0E2127] font-medium mb-3 text-[16px] sm:text-[18px]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-[16px] sm:text-[18px] ${
                      formErrors.phone
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-gray-300 focus:ring-[#FF3133] hover:border-gray-400"
                    }`}
                    placeholder="+44 7XXX XXXXXX"
                  />
                  {formErrors.phone && (
                    <p className="mt-2 text-[16px] sm:text-[18px] text-red-600 flex items-center gap-1 font-uber">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[#0E2127] font-medium mb-3 text-[16px] sm:text-[18px]">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={bookingData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-[16px] sm:text-[18px] ${
                    formErrors.dateOfBirth
                      ? "border-red-300 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-[#FF3133] hover:border-gray-400"
                  }`}
                />
                {formErrors.dateOfBirth && (
                  <p className="mt-2 text-[16px] sm:text-[18px] text-red-600 flex items-center gap-1 font-uber">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.dateOfBirth}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#0E2127] font-medium mb-3 text-[16px] sm:text-[18px]">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-[16px] sm:text-[18px] ${
                    formErrors.email
                      ? "border-red-300 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-[#FF3133] hover:border-gray-400"
                  }`}
                  placeholder="your.email@example.com"
                />
                {formErrors.email && (
                  <p className="mt-2 text-[16px] sm:text-[18px] text-red-600 flex items-center gap-1 font-uber">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* How can we help field */}
              <div className="sm:col-span-2">
                <label className="block text-[#0E2127] font-medium mb-3 text-[16px] sm:text-[18px]">
                  How can we help? *
                </label>
                <textarea
                  name="howCanWeHelp"
                  value={bookingData.howCanWeHelp}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-[16px] sm:text-[18px] resize-y ${
                    formErrors.howCanWeHelp
                      ? "border-red-300 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-[#FF3133] hover:border-gray-400"
                  }`}
                  placeholder="Please briefly describe your condition or what you'd like help with (max 100 words)..."
                />
                <div className="flex justify-between items-center mt-2">
                  {formErrors.howCanWeHelp && (
                    <p className="text-[16px] sm:text-[18px] text-red-600 flex items-center gap-1 font-uber">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.howCanWeHelp}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {
                      bookingData.howCanWeHelp
                        .split(" ")
                        .filter((word) => word.length > 0).length
                    }
                    /100 words
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF3133]/10">
                <Calendar className="w-5 h-5 text-[#FF3133]" />
              </div>
              <h3 className="font-axiforma text-[24px] text-[#0E2127]">
                Appointment Details
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-[#0E2127] font-medium mb-3 text-[16px] sm:text-[18px]">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleInputChange}
                    min={today}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3133] focus:border-transparent transition-all hover:border-gray-400 text-[16px] sm:text-[18px]"
                  />
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <TimeSlotSelector
                  selectedDate={bookingData.date}
                  selectedTime={bookingData.time}
                  onTimeSelect={handleTimeSelect}
                  sessionDuration={bookingData.sessionType?.duration || 30}
                />
              </div>

              {bookingData.sessionType && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-[16px] sm:text-[18px] text-blue-800 font-uber">
                    <span className="font-semibold">Selected:</span>{" "}
                    {bookingData.sessionType.name} (
                    {bookingData.sessionType.duration} minutes)
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-axiforma text-[24px] text-[#0E2127]">
                Review and Confirm
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div className="text-center mb-6">
                <h4 className="text-lg font-axiforma text-[#0E2127] mb-2">
                  Please review your booking details
                </h4>
                <p className="text-gray-600 text-[16px] sm:text-[18px] font-uber">
                  Make sure all information is correct before submitting
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Session Details */}
                <div className="space-y-4">
                  <h5 className="font-semibold text-[#0E2127] text-[16px] sm:text-[18px] uppercase tracking-wide border-b border-gray-200 pb-2">
                    Session Details
                  </h5>
                  {bookingData.sessionType && (
                    <div className="flex justify-between items-start py-2">
                      <span className="text-gray-600 text-[16px] sm:text-[18px]">
                        Session Type:
                      </span>
                      <span className="font-medium text-[16px] sm:text-[18px] text-right">
                        {bookingData.sessionType.name}
                      </span>
                    </div>
                  )}
                  {bookingData.sessionType && (
                    <div className="flex justify-between items-start py-2">
                      <span className="text-gray-600 text-[16px] sm:text-[18px]">Duration:</span>
                      <span className="font-medium text-[16px] sm:text-[18px]">
                        {bookingData.sessionType.duration} minutes
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-start py-2">
                    <span className="text-gray-600 text-[16px] sm:text-[18px]">Service:</span>
                    <span className="font-medium text-[16px] sm:text-[18px] text-right">
                      {getServiceName(bookingData.serviceCategory)}
                    </span>
                  </div>
                  <div className="flex justify-between items-start py-2">
                    <span className="text-gray-600 text-[16px] sm:text-[18px]">Date:</span>
                    <span className="font-medium text-[16px] sm:text-[18px] text-right">
                      {new Date(bookingData.date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-start py-2">
                    <span className="text-gray-600 text-[16px] sm:text-[18px]">Time:</span>
                    <span className="font-medium text-[16px] sm:text-[18px]">
                      {bookingData.time}
                    </span>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="space-y-4">
                  <h5 className="font-semibold text-[#0E2127] text-[16px] sm:text-[18px] uppercase tracking-wide border-b border-gray-200 pb-2">
                    Personal Details
                  </h5>
                  <div className="flex justify-between items-start py-2">
                    <span className="text-gray-600 text-[16px] sm:text-[18px]">Name:</span>
                    <span className="font-medium text-[16px] sm:text-[18px] text-right">
                      {bookingData.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-start py-2">
                    <span className="text-gray-600 text-[16px] sm:text-[18px]">Email:</span>
                    <span className="font-medium text-[16px] sm:text-[18px] text-right break-all">
                      {bookingData.email}
                    </span>
                  </div>
                  <div className="flex justify-between items-start py-2">
                    <span className="text-gray-600 text-[16px] sm:text-[18px]">Date of Birth:</span>
                    <span className="font-medium text-[16px] sm:text-[18px] text-right">
                      {bookingData.dateOfBirth
                        ? new Date(bookingData.dateOfBirth).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-start py-2">
                    <span className="text-gray-600 text-[16px] sm:text-[18px]">Phone:</span>
                    <span className="font-medium text-[16px] sm:text-[18px]">
                      {bookingData.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              {(bookingData.message || bookingData.howCanWeHelp) && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h5 className="font-semibold text-[#0E2127] text-[16px] sm:text-[18px] uppercase tracking-wide">
                    Medical Information
                  </h5>
                  {/* {bookingData.howCanWeHelp && (
                    <div>
                      <span className="text-gray-600 text-[16px] sm:text-[18px] block mb-2">
                        How can we help:
                      </span>
                      <p className="text-[16px] sm:text-[18px] bg-white p-3 rounded border text-gray-700 font-uber">
                        {bookingData.howCanWeHelp}
                      </p>
                    </div>
                  )} */}
                  {bookingData.message && (
                    <div>
                      <span className="text-gray-600 text-[16px] sm:text-[18px] block mb-2">
                        Condition/Reason for visit:
                      </span>
                      <p className="text-[16px] sm:text-[18px] bg-white p-3 rounded border text-gray-700 font-uber">
                        {bookingData.message}
                      </p>
                    </div>
                  )}
                  {bookingData.medicalHistory && (
                    <div>
                      <span className="text-gray-600 text-[16px] sm:text-[18px] block mb-2">
                        Medical History:
                      </span>
                      <p className="text-[16px] sm:text-[18px] bg-white p-3 rounded border text-gray-700 font-uber">
                        {bookingData.medicalHistory}
                      </p>
                    </div>
                  )}
                  {bookingData.currentMedications && (
                    <div>
                      <span className="text-gray-600 text-[16px] sm:text-[18px] block mb-2">
                        Current Medications:
                      </span>
                      <p className="text-[16px] sm:text-[18px] bg-white p-3 rounded border text-gray-700 font-uber">
                        {bookingData.currentMedications}
                      </p>
                    </div>
                  )}
                  {bookingData.previousPhysiotherapy && (
                    <div>
                      <span className="text-gray-600 text-[16px] sm:text-[18px] block mb-2">
                        Previous Physiotherapy:
                      </span>
                      <p className="text-[16px] sm:text-[18px] bg-white p-3 rounded border text-gray-700 font-uber">
                        {bookingData.previousPhysiotherapy}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h6 className="font-semibold text-blue-800 mb-3 text-[16px] sm:text-[18px]">
                    Important Notice
                  </h6>
                  <ul className="text-[16px] sm:text-[18px] text-blue-700 space-y-2 list-disc list-inside">
                    <li>
                      We'll contact you within 24 hours to confirm your
                      appointment
                    </li>
                    <li>Please arrive 10 minutes early for your session</li>
                    <li>Bring comfortable clothing suitable for movement</li>
                    <li>
                      If you need to cancel, please call us at least 24 hours in
                      advance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="site-container py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/"
              className="group flex items-center gap-3 text-[16px] font-semibold text-[#0E2127] transition-colors hover:text-[#FF3133]"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>

            <div className="sm:text-right">
              <h3 className="mb-1 font-axiforma text-[24px] text-[#0E2127]">
                Book Appointment
              </h3>
              <p className="font-uber text-[16px] text-gray-600">
                Schedule your physiotherapy session
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="site-container py-6 lg:py-8">
        {submitStatus === "success" && bookingResponse && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Booking Submitted Successfully!
                </h3>
                <p className="text-green-700 text-[16px] sm:text-[18px] mb-4 font-uber">
                  {bookingResponse.message}
                </p>
                {bookingResponse.booking && (
                  <div className="bg-green-100 rounded-lg p-4 space-y-2">
                    <p className="text-[16px] sm:text-[18px] text-green-800 font-uber">
                      <span className="font-semibold">
                        Confirmation Number:
                      </span>{" "}
                      {bookingResponse.booking.confirmationNumber}
                    </p>
                    <p className="text-[16px] sm:text-[18px] text-green-800 font-uber">
                      <span className="font-semibold">Date & Time:</span>{" "}
                      {bookingResponse.booking.date} at{" "}
                      {bookingResponse.booking.time}
                    </p>
                    {bookingResponse.booking.sessionType && (
                      <p className="text-[16px] sm:text-[18px] text-green-800 font-uber">
                        <span className="font-semibold">Session:</span>{" "}
                        {bookingResponse.booking.sessionType} session (
                        {bookingResponse.booking.sessionDuration} minutes)
                      </p>
                    )}
                  </div>
                )}
                <p className="text-[16px] sm:text-[18px] text-green-600 mt-3 font-uber">
                  Redirecting to home page in 5 seconds...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Booking Submission Failed
                </h3>
                <p className="text-red-700 text-[16px] sm:text-[18px] font-uber">
                  {errorMessage ||
                    "Please try again or call us directly at +44 7460 091561"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Stepper - Clean and Separated */}
        <div className="mb-6 pb-6">
          <ProgressStepper steps={stepTitles} currentStep={currentStep} />
        </div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Form Container */}
          <div className="p-4 sm:p-6 lg:p-8">
            {submitStatus !== "success" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step Content */}
                <div className="min-h-[300px]">{renderStepContent()}</div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium transition-all ${
                      currentStep === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentStep < finalStep ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceedToNextStep()}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-medium transition-all ${
                        canProceedToNextStep()
                          ? "bg-[#FF3133] text-white hover:bg-[#e62a2c] border border-[#FF3133]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
                      }`}
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || !canProceedToNextStep()}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-medium transition-all ${
                        isSubmitting || !canProceedToNextStep()
                          ? "bg-gray-400 cursor-not-allowed border border-gray-400"
                          : "bg-[#FF3133] hover:bg-[#e62a2c] text-white border border-[#FF3133]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Booking"
                      )}
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-[16px] sm:text-[18px] font-axiforma text-[#0E2127] mb-2">
                  Booking Completed Successfully!
                </h3>
                <p className="text-gray-600 text-[16px] sm:text-[18px] font-uber mb-6">
                  Your appointment has been submitted and we'll contact you
                  within 24 hours to confirm.
                </p>
                <Link
                  href="/"
                  className="btn-primary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Home
                </Link>
              </div>
            )}

            {/* Footer Notice - Only show when form is visible */}
            {submitStatus !== "success" && (
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-[16px] sm:text-[18px] text-gray-600 font-uber leading-relaxed">
                  * Required fields. We'll contact you within 24 hours to
                  confirm your appointment.
                  <br />
                  For urgent matters, please call us directly at{" "}
                  <a
                    href="tel:+447460091561"
                    className="text-[#FF3133] hover:underline font-medium"
                  >
                    +44 7460 091561
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component to provide context
const BookingPageWrapper = () => {
  return (
    <BookingProvider>
      <BookingPage />
      <Footer />
    </BookingProvider>
  );
};

export default BookingPageWrapper;
