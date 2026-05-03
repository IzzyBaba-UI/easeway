"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { physiotherapyServices } from "../../data/services";

const Services = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_70%)]" />

      <div className="relative z-10">
        <div className="mb-16 px-6 text-center">
          <div className="inline-flex items-center rounded-full border border-[#FF3133]/10 bg-[#FF3133]/5 px-4 py-2">
            <Building2 className="mr-2 h-4 w-4 text-[#FF3133]" />
            <span className="font-axiforma text-body-sm text-[#FF3133]">
              Our Services
            </span>
          </div>

          <h2 className="mx-auto mb-6 mt-4 max-w-xl font-axiforma text-h3-mobile leading-tight tracking-tight text-gray-900 sm:mb-8 sm:text-h2-small">
            Professional Physiotherapy Services
          </h2>

          <p className="mx-auto mt-3 max-w-md px-4 font-uber text-body leading-relaxed text-gray-600 sm:mt-4">
            Comprehensive physiotherapy treatments designed to help you overcome
            pain, regain mobility, and return to your active lifestyle with
            confidence.
          </p>
        </div>

        <div className="pointer-events-none absolute left-6 right-6 top-1/3 z-20 hidden -translate-y-1/2 items-center justify-between sm:flex">
          <button
            onClick={scrollLeft}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF3133]/30 bg-[#FF3133]/40 backdrop-blur-md transition-all duration-300 hover:bg-[#FF3133]/60"
            aria-label="Scroll services left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700 transition-colors" />
          </button>
          <button
            onClick={scrollRight}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF3133]/30 bg-[#FF3133]/40 backdrop-blur-md transition-all duration-300 hover:bg-[#FF3133]/60"
            aria-label="Scroll services right"
          >
            <ChevronRight className="h-6 w-6 text-gray-700 transition-colors" />
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-4 sm:gap-6 sm:px-6 lg:px-8"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {physiotherapyServices.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative w-72 flex-shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/30 ring-1 ring-gray-300/50 backdrop-blur-md transition-all duration-500 hover:bg-white/50 hover:backdrop-blur-lg sm:w-80 sm:rounded-3xl"
              >
                {service.highlight && (
                  <div className="absolute right-6 top-6 z-10">
                    <span className="rounded-full bg-gray-900/80 px-4 py-2 font-axiforma text-body-xs text-white">
                      Exclusive
                    </span>
                  </div>
                )}

                <div className="relative h-40 overflow-hidden sm:h-48">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-white/40 backdrop-blur-md sm:h-12 sm:w-12 sm:rounded-xl">
                      <Icon className="h-5 w-5 text-gray-800 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="mb-2 font-uber text-md font-bold leading-tight text-gray-900 sm:mb-3">
                    {service.title}
                  </h3>
                  <p className="mt-3 font-uber text-body leading-relaxed text-gray-600 sm:mt-4">
                    {service.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 font-axiforma text-button text-[#FF3133]">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>

        <motion.div
          className="mt-10 px-4 text-center sm:mt-12 sm:px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E2127] px-5 py-3 font-axiforma text-button-lg text-white transition-colors hover:bg-[#18343d]"
          >
            View All Services
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
