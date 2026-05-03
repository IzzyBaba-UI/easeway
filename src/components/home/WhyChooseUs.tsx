"use client";

import { motion } from "framer-motion";
import { User, Building2, UserCheck, Sprout, Handshake } from "lucide-react";
import { MyFillButton } from "../reusables/Button";

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: User,
      title: "Personalized Treatment",
      description:
        "Tailored plans for faster recovery. We focus on what works best for you with treatment plans designed for your specific needs and goals.",
    },
    {
      icon: Building2,
      title: "Comprehensive Care",
      description:
        "Therapies for all recovery stages. A full range of therapies and support services to address all aspects of your recovery and well-being.",
    },
    {
      icon: UserCheck,
      title: "Experienced Professionals",
      description:
        "Skilled and qualified team. Led by experienced physiotherapists with extensive training in modern treatment techniques and patient care.",
    },
    {
      icon: Sprout,
      title: "Holistic Approach",
      description:
        "Focused on long-term wellness. Treating the whole person for lasting recovery, addressing not just symptoms but underlying causes.",
    },
  ];

  return (
    <section className="bg-[#0e2127] py-16 text-white sm:py-20 md:py-24">
      <div className="site-container">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-3 flex items-center justify-center gap-2 font-axiforma text-[30px] sm:mb-4 sm:gap-3 sm:text-[36px]">
              <Handshake className="h-6 w-6 text-[#FF3133] sm:h-7 sm:w-7" />
              {""}
              Why Choose Us?
            </h2>
            <p className="mx-auto max-w-xl px-4 font-uber text-[17px] leading-7 text-gray-200">
              Your health and recovery are our priority. Here's what sets us
              apart.
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group rounded-lg border border-white/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF3133]/10 transition-transform duration-300 group-hover:scale-105 sm:mb-6 sm:h-14 sm:w-14">
                <reason.icon className="h-6 w-6 text-[#FF3133] sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-3 font-axiforma text-[20px] text-[#0E2127] sm:mb-4">
                {reason.title}
              </h3>
              <p className="font-uber text-[16px] leading-7 text-gray-600">
                {reason.description}
              </p>

              {/* Hover effect border */}
              <div className="mt-4 h-1 w-0 bg-[#FF3133] transition-all duration-300 group-hover:w-full sm:mt-6"></div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center sm:mt-14 md:mt-16"
        >
          <div className="mx-auto max-w-2xl rounded-lg border border-white/10 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="mb-3 font-axiforma text-[24px] text-[#0E2127] sm:mb-4 sm:text-[26px]">
              Ready to Start Your Recovery Journey?
            </h3>
            <p className="mb-4 px-2 font-uber text-[17px] leading-7 text-gray-600 sm:mb-6">
              Experience the difference personalized physiotherapy care can make
              in your life.
            </p>
            <MyFillButton
              text="Book appointment"
              link="/booking"
              bgColor="#FF3133"
              hoverBgColor="#e62a2c"
              color="white"
              hoverTextColor="white"
              ariaLabel="Book appointment"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
