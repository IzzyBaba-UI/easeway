"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ServiceFaq } from "../../data/services";

type FaqAccordionProps = {
  faqs: ServiceFaq[];
};

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 rounded-none bg-white px-5 py-4 text-left text-gray-950 transition-colors hover:bg-gray-50"
              aria-expanded={isOpen}
            >
              <span className="font-axiforma text-[18px] font-semibold leading-snug">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 text-[#FF3133] transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5">
                <p className="max-w-3xl text-[17px] leading-7 text-gray-600">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
