"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SessionType {
  id: "new" | "followup";
  name: string;
  duration: number;
  description: string;
  price?: string;
}

// Added: service category determines price mapping
export type ServiceCategory =
  | "clinic"
  | "home"
  | "virtual"
  | "sports"
  | "acupuncture"
  | "";

export interface BookingFormData {
  // Service category first
  serviceCategory: ServiceCategory; // new
  // Session details
  sessionType: SessionType | null;

  // Personal information
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContact: string;

  // Appointment details
  service: string; // auto-generated service name based on category
  date: string;
  time: string;

  // Medical information
  message: string;
  howCanWeHelp: string;
  medicalHistory: string;
  currentMedications: string;
  previousPhysiotherapy: string;

  // Additional preferences
  preferredTherapist?: string;
  specialRequirements?: string;
}

interface BookingContextType {
  bookingData: BookingFormData;
  updateBookingData: (data: Partial<BookingFormData>) => void;
  resetBookingData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
}

const initialBookingData: BookingFormData = {
  serviceCategory: "",
  sessionType: null,
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  emergencyContact: "",
  service: "",
  date: "",
  time: "",
  message: "",
  howCanWeHelp: "",
  medicalHistory: "",
  currentMedications: "",
  previousPhysiotherapy: "",
  preferredTherapist: "",
  specialRequirements: "",
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({
  children,
}) => {
  const [bookingData, setBookingData] =
    useState<BookingFormData>(initialBookingData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const updateBookingData = (data: Partial<BookingFormData>) => {
    setBookingData((prev) => {
      // If date is being changed, clear the selected time
      if (data.date !== undefined && data.date !== prev.date) {
        return {
          ...prev,
          ...data,
          time: "", // Clear time when date changes
        };
      }

      // If service category changes, reset sessionType to force re-selection with new pricing
      if (
        data.serviceCategory !== undefined &&
        data.serviceCategory !== prev.serviceCategory
      ) {
        return {
          ...prev,
          ...data,
          sessionType: null,
        };
      }

      return {
        ...prev,
        ...data,
      };
    });
  };

  const resetBookingData = () => {
    setBookingData(initialBookingData);
    setCurrentStep(0);
    setIsComplete(false);
  };

  const value: BookingContextType = {
    bookingData,
    updateBookingData,
    resetBookingData,
    currentStep,
    setCurrentStep,
    isComplete,
    setIsComplete,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};
