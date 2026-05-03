"use client";

import { motion } from "framer-motion";
import { Building2, Home, Target, Waves, Check } from "lucide-react";

export interface ServiceTypeOption {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>; // lucide icon component
}

interface ServiceTypeSelectionProps {
  selectedService: string;
  onServiceTypeSelect: (serviceKey: string) => void;
}

const serviceTypes: ServiceTypeOption[] = [
  {
    key: "clinic",
    label: "Clinic Booking",
    description: "In-clinic physiotherapy assessment & treatment",
    icon: Building2,
  },
  {
    key: "home",
    label: "Home Visit",
    description: "Physiotherapy delivered in the comfort of your home",
    icon: Home,
  },
  {
    key: "virtual",
    label: "Virtual Consultation",
    description: "Video physiotherapy consultation done remotely",
    icon: Home, // reuse home icon for now; could swap for a monitor icon later
  },
  {
    key: "sports",
    label: "Sports Massage",
    description: "Performance & recovery focused soft tissue therapy",
    icon: Waves,
  },
  {
    key: "acupuncture",
    label: "Acupuncture",
    description: "Needling therapy integrated with physiotherapy care",
    icon: Target,
  },
];

const ServiceTypeSelection: React.FC<ServiceTypeSelectionProps> = ({
  selectedService,
  onServiceTypeSelect,
}) => {
  return (
    <div className="space-y-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF3133]/10">
          <Building2 className="w-5 h-5 text-[#FF3133]" />
        </div>
        <h3 className="font-axiforma text-[24px] text-[#0E2127]">
          Select Service Type
        </h3>
      </div>

      {/* Service Type Selection */}
      <div>
        <h4 className="mb-3 text-[18px] font-semibold text-[#0E2127]">
          Choose Service Type
        </h4>
        <p className="mb-4 font-uber text-[16px] leading-6 text-gray-600">
          Choose the type of service you are booking so we can prepare the
          right appointment options.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceTypes.map((service) => {
            const isSelected = selectedService === service.key;
            const Icon = service.icon;
            return (
              <motion.button
                key={service.key}
                type="button"
                onClick={() => onServiceTypeSelect(service.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex h-full flex-col rounded-lg border p-5 text-left transition-all duration-200 ${
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

                <h4
                  className={`mb-2 text-[17px] font-semibold ${
                    isSelected ? "text-[#FF3133]" : "text-[#0E2127]"
                  }`}
                >
                  {service.label}
                </h4>
                <p className="flex-grow font-uber text-[16px] leading-6 text-gray-600">
                  {service.description}
                </p>

                {isSelected && (
                  <div className="mt-4 font-axiforma text-[15px] font-semibold text-[#FF3133]">
                    Selected
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Pricing Information Container */}
      <BlockOf5Info />
    </div>
  );
};

export default ServiceTypeSelection;

export const BlockOf5Info = () => {
  return (
    <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
          <Building2 className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="mb-3 text-[17px] font-semibold text-blue-900">
            Block Session Pricing (5 Sessions)
          </h4>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-[16px] font-medium text-blue-800">
                Clinic Booking
              </div>
              <div className="text-[16px] text-blue-600">
                New: £260 | Follow-up: £235
              </div>
            </div>
            <div>
              <div className="text-[16px] font-medium text-blue-800">
                Home Visit
              </div>
              <div className="text-[16px] text-blue-600">
                New: £380 | Follow-up: £330
              </div>
            </div>
            <div>
              <div className="text-[16px] font-medium text-blue-800">
                Sports Massage
              </div>
              <div className="text-[16px] text-blue-600">
                £190
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
