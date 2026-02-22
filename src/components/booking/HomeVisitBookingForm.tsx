"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Home, Check, ArrowLeft, AlertCircle } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import { BlockOf5Info } from "./ServiceTypeSelection";

interface HomeVisitFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  message: string;
  howCanWeHelp: string;
  sessionType: "new" | "followup";
}

interface HomeVisitBookingFormProps {
  onBack: () => void;
  isVirtual?: boolean; // when true, treat as virtual consultation
}

const HomeVisitBookingForm: React.FC<HomeVisitBookingFormProps> = ({
  onBack,
  isVirtual = false,
}) => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState<HomeVisitFormData>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    message: "",
    howCanWeHelp: "",
    sessionType: "new",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear form error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }
    if (!formData.howCanWeHelp.trim()) {
      errors.howCanWeHelp = "Please describe how we can help you";
    } else {
      const wordCount = formData.howCanWeHelp
        .split(" ")
        .filter((word) => word.length > 0).length;
      if (wordCount > 100) {
        errors.howCanWeHelp =
          "Please limit your description to 100 words or less";
      }
    }
    if (!formData.message.trim()) {
      errors.message = "Please describe your condition or reason for visit";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError(
        "Please fill in all required fields",
        "Check the highlighted fields and try again."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const pricing = isVirtual
        ? {
            new: { price: "£45", duration: 40 },
            followup: { price: "£40", duration: 30 },
          }
        : {
            new: { price: "£80", duration: 40 },
            followup: { price: "£70", duration: 30 },
          };

      const sessionInfo = pricing[formData.sessionType];

      const bookingPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        serviceCategory: isVirtual ? "virtual" : "home",
        service: isVirtual ? "Virtual Consultation" : "Home Visit",
        date: "TBD", // home & virtual consultations are scheduled manually
        time: "TBD", // will be arranged by phone / email
        sessionType: formData.sessionType,
        sessionDuration: sessionInfo.duration,
        message: formData.message,
        howCanWeHelp: formData.howCanWeHelp,
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
        setConfirmationNumber(data.booking.confirmationNumber);
        setIsSuccess(true);
        showSuccess(
          isVirtual
            ? "Virtual Consultation Request Received!"
            : "Home Visit Booking Confirmed!",
          isVirtual
            ? "We'll contact you within 24 hours to arrange your video consultation."
            : "We'll call you within 24 hours to schedule your home visit appointment."
        );
      } else {
        showError(
          "Booking failed",
          data.error || "Please try again or call us directly."
        );
      }
    } catch (error) {
      console.error("Home visit booking error:", error);
      showError(
        "Connection error",
        "Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-axiforma text-[#0E2127] mb-4">
          {isVirtual
            ? "Virtual Consultation Request Received!"
            : "Home Visit Booking Confirmed!"}
        </h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
          <p className="text-green-800 font-medium mb-2">
            Confirmation Number: {confirmationNumber}
          </p>
          <p className="text-green-700 text-base">
            Session Type:{" "}
            {formData.sessionType === "new"
              ? `Initial Meeting (40 min) - ${isVirtual ? "£45" : "£80"}`
              : `Follow-up Session (30 min) - ${isVirtual ? "£40" : "£70"}`}
          </p>
        </div>
        <p className="text-gray-600 text-base font-uber mb-8 max-w-lg mx-auto">
          {isVirtual
            ? "Thank you for requesting a virtual consultation! We'll contact you within 24 hours to arrange a convenient video session."
            : "Thank you for booking a home visit! We'll contact you within 24 hours to arrange a convenient time for your appointment."}
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF3133] text-white rounded-lg hover:bg-[#e62a2c] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#FF3133]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="w-8 h-8 text-[#FF3133]" />
        </div>
        <h2 className="text-lg font-axiforma text-[#0E2127] mb-2">
          {isVirtual ? "Request Virtual Consultation" : "Book Home Visit"}
        </h2>
        <p className="text-gray-600 font-uber">
          {isVirtual
            ? "Fill out the form below and we'll contact you to arrange your video consultation"
            : "Fill out the form below and we'll contact you to schedule your home visit"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Session Type Selection */}

        <div>
          <BlockOf5Info />
          <label className="block text-[#0E2127] font-medium mb-3 text-base mt-4">
            Session Type *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, sessionType: "new" }))
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.sessionType === "new"
                  ? "border-[#FF3133] bg-[#FF3133]/5"
                  : "border-gray-200 bg-white hover:border-[#FF3133]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4
                  className={`font-semibold ${
                    formData.sessionType === "new"
                      ? "text-[#FF3133]"
                      : "text-[#0E2127]"
                  }`}
                >
                  Initial Meeting
                </h4>
                {formData.sessionType === "new" && (
                  <Check className="w-5 h-5 text-[#FF3133]" />
                )}
              </div>
              <p className="text-base text-gray-600 mb-2">40 minutes</p>
              <p className="text-base font-bold text-[#0E2127]">
                {isVirtual ? "£45" : "£80"}
              </p>
            </motion.button>

            <motion.button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, sessionType: "followup" }))
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.sessionType === "followup"
                  ? "border-[#FF3133] bg-[#FF3133]/5"
                  : "border-gray-200 bg-white hover:border-[#FF3133]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4
                  className={`font-semibold ${
                    formData.sessionType === "followup"
                      ? "text-[#FF3133]"
                      : "text-[#0E2127]"
                  }`}
                >
                  Follow-up Session
                </h4>
                {formData.sessionType === "followup" && (
                  <Check className="w-5 h-5 text-[#FF3133]" />
                )}
              </div>
              <p className="text-base text-gray-600 mb-2">30 minutes</p>
              <p className="text-base font-bold text-[#0E2127]">
                {isVirtual ? "£40" : "£70"}
              </p>
            </motion.button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-[#0E2127] font-medium mb-3 text-base">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-base ${
                formErrors.name
                  ? "border-red-300 focus:ring-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-[#FF3133] hover:border-gray-400"
              }`}
              placeholder="Your full name"
            />
            {formErrors.name && (
              <p className="mt-2 text-base text-red-600 flex items-center gap-1 font-uber">
                <AlertCircle className="w-4 h-4" />
                {formErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#0E2127] font-medium mb-3 text-base">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-base ${
                formErrors.phone
                  ? "border-red-300 focus:ring-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-[#FF3133] hover:border-gray-400"
              }`}
              placeholder="+44 7XXX XXXXXX"
            />
            {formErrors.phone && (
              <p className="mt-2 text-base text-red-600 flex items-center gap-1 font-uber">
                <AlertCircle className="w-4 h-4" />
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-[#0E2127] font-medium mb-3 text-base">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-base ${
                formErrors.email
                  ? "border-red-300 focus:ring-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-[#FF3133] hover:border-gray-400"
              }`}
              placeholder="your.email@example.com"
            />
            {formErrors.email && (
              <p className="mt-2 text-base text-red-600 flex items-center gap-1 font-uber">
                <AlertCircle className="w-4 h-4" />
                {formErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#0E2127] font-medium mb-3 text-base">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              max={new Date().toISOString().split("T")[0]}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-base ${
                formErrors.dateOfBirth
                  ? "border-red-300 focus:ring-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-[#FF3133] hover:border-gray-400"
              }`}
            />
            {formErrors.dateOfBirth && (
              <p className="mt-2 text-base text-red-600 flex items-center gap-1 font-uber">
                <AlertCircle className="w-4 h-4" />
                {formErrors.dateOfBirth}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[#0E2127] font-medium mb-3 text-base">
            How can we help? *
          </label>
          <textarea
            name="howCanWeHelp"
            value={formData.howCanWeHelp}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-base resize-y ${
              formErrors.howCanWeHelp
                ? "border-red-300 focus:ring-red-500 bg-red-50"
                : "border-gray-300 focus:ring-[#FF3133] hover:border-gray-400"
            }`}
            placeholder="Please briefly describe your condition or what you'd like help with (max 100 words)..."
          />
          <div className="flex justify-between items-center mt-2">
            {formErrors.howCanWeHelp && (
              <p className="text-base text-red-600 flex items-center gap-1 font-uber">
                <AlertCircle className="w-4 h-4" />
                {formErrors.howCanWeHelp}
              </p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {
                formData.howCanWeHelp
                  .split(" ")
                  .filter((word) => word.length > 0).length
              }
              /100 words
            </p>
          </div>
        </div>

        <div>
          <label className="block text-[#0E2127] font-medium mb-3 text-base">
            Condition / Reason for Visit *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-base resize-none ${
              formErrors.message
                ? "border-red-300 focus:ring-red-500 bg-red-50"
                : "border-gray-300 focus:ring-[#FF3133] hover:border-gray-400"
            }`}
            placeholder="Please describe your current condition, symptoms, or reason for seeking physiotherapy..."
          />
          {formErrors.message && (
            <p className="mt-2 text-base text-red-600 flex items-center gap-1 font-uber">
              <AlertCircle className="w-4 h-4" />
              {formErrors.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Service Selection
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed border border-gray-400"
                : "bg-[#FF3133] hover:bg-[#e62a2c] text-white border border-[#FF3133]"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : isVirtual ? (
              "Request Virtual Consultation"
            ) : (
              "Book Home Visit"
            )}
          </button>
        </div>
      </form>

      {/* Info Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2 text-base">
          Important Information
        </h4>
        {isVirtual ? (
          <ul className="text-base text-blue-700 space-y-1 list-disc list-inside">
            <li>
              We'll contact you within 24 hours to schedule your video call
            </li>
            <li>Ensure you have a stable internet connection</li>
            <li>No special software needed; we'll send a secure link</li>
            <li>Have space available to perform basic movement tests</li>
          </ul>
        ) : (
          <ul className="text-base text-blue-700 space-y-1 list-disc list-inside">
            <li>
              We'll contact you within 24 hours to schedule your home visit
            </li>
            <li>Our team will work with you to find a convenient time</li>
            <li>All equipment will be brought to your location</li>
            <li>Payment can be made on the day of your visit</li>
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default HomeVisitBookingForm;
