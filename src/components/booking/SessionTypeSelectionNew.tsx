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
      <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-base text-gray-600 font-uber">
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#FF3133]/10 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-[#FF3133]" />
        </div>
        <h3 className="text-base font-axiforma text-[#0E2127]">
          Session Type & Duration
        </h3>
      </div>

      <p className="text-base text-gray-600 mb-6 font-uber">
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
              className={`relative p-5 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? "border-[#FF3133] bg-[#FF3133]/5"
                  : "border-gray-200 bg-white hover:border-[#FF3133]/50"
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-[#FF3133] rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
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
                  className={`font-semibold mb-3 text-base ${
                    isSelected ? "text-[#FF3133]" : "text-[#0E2127]"
                  }`}
                >
                  {session.name}
                </h4>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-base text-gray-600 font-uber">
                      {session.duration} minutes
                    </span>
                  </div>
                  {session.price && (
                    <div className="text-base font-medium text-[#0E2127]">
                      {session.price}
                    </div>
                  )}
                </div>
                <p className="text-base text-gray-600 font-uber leading-relaxed">
                  {session.description}
                </p>
              </div>
              <div
                className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-body-xs font-axiforma ${
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
          className="mt-6 p-4 bg-[#FF3133]/5 border border-[#FF3133]/20 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-[#FF3133]" />
            <span className="text-[#FF3133] font-medium text-base">
              Selected: {selectedSession.name}
            </span>
          </div>
          <p className="text-body text-gray-600 font-uber">
            Duration: {selectedSession.duration} minutes
            {selectedSession.price ? ` | ${selectedSession.price}` : ""}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SessionTypeSelection;
