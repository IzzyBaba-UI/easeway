"use client";

import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="w-full">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center rounded-full border border-[#FF3133]/10 bg-[#FF3133]/5 px-3 py-2 sm:px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-[15px] font-semibold text-[#FF3133]">
                About Us
              </span>
            </motion.div>

            <div>
              <motion.h2
                className="font-axiforma text-[30px] leading-tight text-[#0E2127] sm:text-[36px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                About Easeway Medicare Physiotherapy Clinic
              </motion.h2>

              <p className="mt-3 font-uber text-[17px] leading-7 text-gray-600 sm:mt-4">
                At Easeway Medicare Physiotherapy Clinic, we believe that
                everyone deserves to live without pain and move freely. Our
                dedicated team is committed to providing personalized,
                evidence-based treatment that addresses the root cause of your
                condition and restore functional capacity.
              </p>
            </div>

            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="rounded-lg border border-gray-100 bg-white p-3 text-center shadow-sm">
                <div className="mb-1 font-axiforma text-[26px] text-[#FF3133] sm:mb-2 sm:text-[30px]">
                  500+
                </div>
                <div className="font-uber text-[15px] font-medium text-gray-600 sm:text-[16px]">
                  Patients Treated
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 bg-white p-3 text-center shadow-sm">
                <div className="mb-1 font-axiforma text-[26px] text-[#FF3133] sm:mb-2 sm:text-[30px]">
                  10+
                </div>
                <div className="font-uber text-[15px] font-medium text-gray-600 sm:text-[16px]">
                  Years Experience
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-2 sm:gap-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                "Qualified Professionals",
                "Modern Equipment",
                "Personalized Care",
                "Proven Results",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center space-x-2 rounded-full border border-gray-100 bg-[#0E2127]/10 px-3 py-2 sm:px-4"
                >
                  <div className="w-1 h-1 bg-[#FF3133] rounded-full"></div>
                  <span className="text-[16px] font-medium text-[#0E2127]">
                    {feature}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Large image top-left */}
              <motion.div
                className="relative row-span-2 overflow-hidden rounded-lg shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/fx3.jpg"
                  alt="Professional physiotherapy treatment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2127]/20 to-transparent" />
              </motion.div>

              {/* Small image top-right */}
              <motion.div
                className="relative overflow-hidden rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/fx1.jpg"
                  alt="Modern physiotherapy equipment"
                  className="h-36 w-full object-cover sm:h-40 lg:h-44"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2127]/20 to-transparent" />
              </motion.div>

              {/* Small image bottom-right */}
              <motion.div className="relative overflow-hidden rounded-lg">
                <motion.img
                  src="/images/fx8.jpg"
                  alt="Patient recovery success"
                  className="h-36 w-full object-cover sm:h-40 lg:h-44"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                ></motion.img>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2127]/20 to-transparent" />
              </motion.div>
            </div>

            {/* Floating element */}
            <motion.div className="absolute -right-3 -top-3 rounded-lg bg-[#FF3133] p-4 text-white shadow-xl sm:-right-4 sm:-top-4">
              <div className="text-center">
                <div className="font-axiforma text-[26px] sm:text-[30px]">
                  98%
                </div>
                <div className="font-axiforma text-[14px]">Success Rate</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
