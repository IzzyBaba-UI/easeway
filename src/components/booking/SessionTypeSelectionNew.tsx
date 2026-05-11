"use client";

import { motion } from "framer-motion";
import { Clock, UserPlus, RefreshCw, Check } from "lucide-react";

export interface SessionType {
  id: "new" | "followup";
  name: string;
  duration: number;
  description: string;
  price?: string;
}

interface SessionTypeSelectionProps {
  selectedSession: SessionType | null;
  onSessionSelect: (session: SessionType) => void;
  serviceCategory?:
    | "clinic"
    | "home"
    | "virtual"
    | "sports"
    | "acupuncture"
    | "";
}

// Pricing configuration per service category
const pricingConfig: Record<
  string,
  {
    new?: string;
    followup?: string;
    newDuration: number;
    followupDuration: number;
  }
> = {
  clinic: {
    new: "£55",
    followup: "£45",
    newDuration: 40,
    followupDuration: 30,
  },
  home: { new: "£80", followup: "£70", newDuration: 40, followupDuration: 30 },
  sports: {
    new: "£45",
    followup: "£40",
    newDuration: 40,
    followupDuration: 30,
  },
  virtual: {
    new: "£55",
    followup: "£45",
    newDuration: 40,
    followupDuration: 30,
  },
  acupuncture: {
    new: "£50",
    followup: "£45",
    newDuration: 60,
    followupDuration: 45,
  },
};

const SessionTypeSelection: React.FC<SessionTypeSelectionProps> = ({
  selectedSession,
  onSessionSelect,
  serviceCategory = "",
}) => {
  // Require service selection first
  if (!serviceCategory) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center font-uber text-[16px] text-gray-600">
        Please select a service type first.
      </div>
    );
  }

  const pricing = pricingConfig[serviceCategory];

  const sessionTypes: SessionType[] = [
    {
      id: "new",
      name: "New Session",
      duration: pricing.newDuration,
      description: "Comprehensive initial assessment and treatment planning",
      price: pricing.new,
    },
    {
      id: "followup",
      name: "Follow-up Session",
      duration: pricing.followupDuration,
      description: "Continued treatment and progress monitoring",
      price: pricing.followup,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF3133]/10">
          <Clock className="w-5 h-5 text-[#FF3133]" />
        </div>
        <h3 className="font-axiforma text-[24px] text-[#0E2127]">
          Session Type & Duration
        </h3>
      </div>

      <p className="mb-6 font-uber text-[16px] leading-6 text-gray-600">
        Select whether this is a new session or a follow-up for your chosen
        service.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {sessionTypes.map((session) => {
          const isSelected = selectedSession?.id === session.id;
          const Icon = session.id === "new" ? UserPlus : RefreshCw;

          return (
            <motion.button
              key={session.id}
              type="button"
              onClick={() => onSessionSelect(session)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`relative rounded-lg border p-5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-[#FF3133] bg-[#FF3133]/5"
                  : "border-gray-200 bg-white hover:border-[#FF3133]/50"
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF3133]"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${
                  isSelected ? "bg-[#FF3133]" : "bg-gray-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                />
              </div>

              <div>
                <h4
                  className={`mb-3 text-[17px] font-semibold ${
                    isSelected ? "text-[#FF3133]" : "text-[#0E2127]"
                  }`}
                >
                  {session.name}
                </h4>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-uber text-[16px] text-gray-600">
                      {session.duration} minutes
                    </span>
                  </div>
                  {session.price && (
                    <div className="text-[16px] font-medium text-[#0E2127]">
                      {session.price}
                    </div>
                  )}
                </div>
                <p className="font-uber text-[16px] leading-6 text-gray-600">
                  {session.description}
                </p>
              </div>
              <div
                className={`absolute bottom-3 right-3 rounded-full px-2 py-1 font-axiforma text-[14px] ${
                  isSelected
                    ? "bg-[#FF3133] text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {session.duration}min
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedSession && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-lg border border-[#FF3133]/20 bg-[#FF3133]/5 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-[#FF3133]" />
            <span className="text-[16px] font-medium text-[#FF3133]">
              Selected: {selectedSession.name}
            </span>
          </div>
          <p className="font-uber text-[16px] text-gray-600">
            Duration: {selectedSession.duration} minutes
            {selectedSession.price ? ` | ${selectedSession.price}` : ""}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SessionTypeSelection;
