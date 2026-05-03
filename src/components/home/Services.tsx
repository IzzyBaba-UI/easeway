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

      <div className="site-container relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center rounded-full border border-[#FF3133]/10 bg-[#FF3133]/5 px-4 py-2">
            <Building2 className="mr-2 h-4 w-4 text-[#FF3133]" />
            <span className="font-axiforma text-[15px] font-semibold text-[#FF3133]">
              Our Services
            </span>
          </div>

          <h2 className="mx-auto mb-6 mt-4 max-w-xl font-axiforma text-[30px] font-semibold leading-tight tracking-tight text-gray-900 sm:mb-8 sm:text-[36px]">
            Professional Physiotherapy Services
          </h2>

          <p className="mx-auto mt-3 max-w-md px-4 font-uber text-[17px] leading-7 text-gray-600 sm:mt-4">
            Comprehensive physiotherapy treatments designed to help you overcome
            pain, regain mobility, and return to your active lifestyle with
            confidence.
          </p>
        </div>

        <div className="pointer-events-none absolute left-4 right-4 top-1/3 z-20 hidden -translate-y-1/2 items-center justify-between sm:flex">
          <button
            onClick={scrollLeft}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#0E2127] p-0 text-white shadow-lg transition-all duration-300 hover:bg-[#FF3133]"
            aria-label="Scroll services left"
          >
            <ChevronLeft
              aria-hidden="true"
              className="block h-6 w-6 flex-shrink-0 text-white"
              strokeWidth={2.75}
            />
          </button>
          <button
            onClick={scrollRight}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#0E2127] p-0 text-white shadow-lg transition-all duration-300 hover:bg-[#FF3133]"
            aria-label="Scroll services right"
          >
            <ChevronRight
              aria-hidden="true"
              className="block h-6 w-6 flex-shrink-0 text-white"
              strokeWidth={2.75}
            />
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto pb-4 sm:gap-5"
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
                className="group relative w-72 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white/70 shadow-sm ring-1 ring-gray-100 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#FF3133]/30 hover:bg-white hover:shadow-md sm:w-80"
              >
                {service.highlight && (
                  <div className="absolute right-6 top-6 z-10">
                    <span className="rounded-full bg-gray-900/80 px-3 py-1.5 font-axiforma text-[14px] text-white">
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-white/45 backdrop-blur-md sm:h-11 sm:w-11">
                      <Icon className="h-5 w-5 text-gray-800 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="mb-2 font-axiforma text-[17px] font-semibold leading-snug text-gray-950 sm:text-[18px]">
                    {service.title}
                  </h3>
                  <p className="mt-3 font-uber text-[16px] leading-6 text-gray-600 sm:mt-4">
                    {service.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 font-axiforma text-[16px] font-semibold text-[#FF3133]">
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
          <Link href="/services" className="btn-dark">
            View All Services
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
