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
}

const sessionTypes: SessionType[] = [
  {
    id: "new",
    name: "New Session",
    duration: 40,
    description: "Comprehensive initial assessment and treatment planning",
    price: "£60",
  },
  {
    id: "followup",
    name: "Follow-up Session",
    duration: 30,
    description: "Continued treatment and progress monitoring",
    price: "£45",
  },
];

const SessionTypeSelection: React.FC<SessionTypeSelectionProps> = ({
  selectedSession,
  onSessionSelect,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#FF3133]/10 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-[#FF3133]" />
        </div>
        <h3 className="text-xl sm:text-2xl font-axiforma text-[#0E2127]">
          Session Type & Duration
        </h3>
      </div>

      <p className="text-[16px] sm:text-[18px] text-gray-600 mb-6 font-uber">
        Please select the type of session you would like to book
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
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-[#FF3133] rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Icon */}
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

              {/* Content */}
              <div>
                <h4
                  className={`font-semibold mb-3 text-[16px] sm:text-[18px] ${
                    isSelected ? "text-[#FF3133]" : "text-[#0E2127]"
                  }`}
                >
                  {session.name}
                </h4>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-[16px] sm:text-[18px] text-gray-600 font-uber">
                      {session.duration} minutes
                    </span>
                  </div>
                  {session.price && (
                    <div className="text-[16px] sm:text-[18px] font-medium text-[#0E2127]">
                      {session.price}
                    </div>
                  )}
                </div>

                <p className="text-[16px] sm:text-[18px] text-gray-600 font-uber leading-relaxed">
                  {session.description}
                </p>
              </div>

              {/* Duration Badge */}
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
            <span className="text-[#FF3133] font-medium text-[16px] sm:text-[18px]">
              Selected: {selectedSession.name}
            </span>
          </div>
          <p className="text-body text-gray-600 font-uber">
            Duration: {selectedSession.duration} minutes |{" "}
            {selectedSession.price}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SessionTypeSelection;
