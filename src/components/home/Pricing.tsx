"use client";

import { motion } from "framer-motion";
import { Building2, Home, Waves, Clock, Star, Users } from "lucide-react";

const Pricing = () => {
  const services = [
    // Clinic Booking
    {
      category: "Clinic Booking",
      icon: Building2,
      name: "Initial Meeting",
      duration: "40 minutes",
      price: "£55",
      description: [
        "Comprehensive musculoskeletal assessment",
        "Detailed treatment plan development",
        "Exercise prescription and home advice",
      ],
    },
    {
      category: "Clinic Booking",
      icon: Building2,
      name: "Follow-up Session",
      duration: "30 minutes",
      price: "£45",
      description: [
        "Targeted treatment session",
        "Progress evaluation and monitoring",
        "Treatment plan adjustments",
      ],
    },
    {
      category: "Clinic Booking",
      icon: Building2,
      name: "Block of 5 Sessions",
      duration: "30 minutes each",
      price: "£230",
      popular: true,
      description: [
        "5 follow-up treatment sessions",
        "Comprehensive progress tracking",
        "Flexible scheduling options",
      ],
    },
    // Home Visit
    {
      category: "Home Visit",
      icon: Home,
      name: "Initial Meeting",
      duration: "40 minutes",
      price: "£80",
      description: [
        "In-home comprehensive assessment",
        "Environment-specific treatment plan",
        "Home safety evaluation",
      ],
      exclusive: true,
    },
    {
      category: "Home Visit",
      icon: Home,
      name: "Follow-up Session",
      duration: "30 minutes",
      price: "£70",
      description: [
        "Targeted home treatment",
        "Progress monitoring",
        "Equipment and exercise guidance",
      ],
      exclusive: true,
    },
    {
      category: "Home Visit",
      icon: Home,
      name: "Block of 5 Sessions",
      duration: "30 minutes each",
      price: "£320",
      popular: true,
      description: [
        "5 home treatment sessions",
        "Flexible scheduling",
        "No travel required",
      ],
      exclusive: true,
    },
    // Sports Massage
    {
      category: "Sports Massage",
      icon: Waves,
      name: "Initial Session",
      duration: "40 minutes",
      price: "£45",
      description: [
        "Movement and muscle assessment",
        "Targeted massage therapy",
        "Performance optimization advice",
      ],
    },
    {
      category: "Sports Massage",
      icon: Waves,
      name: "Follow-up Session",
      duration: "30 minutes",
      price: "£40",
      description: [
        "Focused massage treatment",
        "Recovery optimization",
        "Ongoing performance support",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="py-16 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,49,51,0.02),transparent_70%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center px-3 py-1 bg-[#FF3133]/5 border border-[#FF3133]/10 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Star className="w-4 h-4 mr-2 text-[#FF3133]" />
            <span className="text-[#FF3133] text-body-sm font-axiforma">
              Pricing
            </span>
          </motion.div>

          <motion.h2
            className="text-h3-mobile sm:text-h2-small font-axiforma text-gray-900 mb-4 mt-3 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Our Pricing
          </motion.h2>

          <motion.p
            className="text-body text-gray-600 leading-relaxed font-uber max-w-lg mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Clear, upfront pricing for all our physiotherapy services. No hidden
            fees.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-xl border transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${
                service.popular
                  ? "border-[#FF3133] ring-1 ring-[#FF3133]/20"
                  : "border-gray-200 hover:border-[#FF3133]/30"
              }`}
            >
              {service.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#FF3133] text-white text-body-xs font-axiforma px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}

              {service.exclusive && (
                <div className="absolute top-3 right-3">
                  <span className="bg-gray-900 text-white text-[10px] font-axiforma px-2 py-1 rounded-full">
                    Exclusive
                  </span>
                </div>
              )}

              <div className="p-5 flex flex-col flex-grow">
                {/* Service Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#FF3133]/10 rounded-lg flex items-center justify-center mr-3">
                      <service.icon className="w-4 h-4 text-[#FF3133]" />
                    </div>
                    <div>
                      <p className="text-body-sm text-gray-500 font-uber">
                        {service.category}
                      </p>
                      <h3 className="text-body font-axiforma font-semibold text-gray-900">
                        {service.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-base text-gray-500 mt-4">
                    <Clock className="w-3 h-3" />
                    <span className="font-uber text-base ">
                      {service.duration
                        .replace(" minutes", "min")
                        .replace(" each", "")}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-axiforma font-bold text-gray-900">
                      {service.price}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4 flex-grow">
                  <ul className="space-y-2">
                    {service.description.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-[#FF3133] rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-body text-gray-600 leading-relaxed font-uber">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Book Button */}
                <div className="mt-auto flex justify-start">
                  <a
                    href="/booking"
                    className={`inline-flex items-center justify-center px-6 py-2 rounded-full transition-colors duration-300 text-body-sm font-uber ${
                      service.popular
                        ? "bg-[#FF3133] text-white hover:bg-[#e62a2c]"
                        : "bg-[#0e2127] text-white hover:bg-[#1e1515]"
                    }`}
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special Offer Section */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-[#FF3133]/5 to-[#FF3133]/10 rounded-2xl p-6 border border-[#FF3133]/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FF3133]/10 rounded-xl mb-3">
              <Users className="w-6 h-6 text-[#FF3133]" />
            </div>
            <h3 className="text-body-lg font-axiforma font-semibold text-gray-900 mb-2">
              Special Discount Available
            </h3>
            <p className="text-body text-gray-600 leading-relaxed font-uber mb-4 max-w-xl mx-auto">
              <strong>10% discount</strong> for Manor Leisure Centre registered
              members on all packages.
            </p>
            <div className="inline-flex items-center bg-white rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-[#FF3133] mr-2" />
              <span className="text-body-sm font-axiforma font-medium text-gray-900">
                Manor Leisure Centre Members Save 10%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        {/* <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-body-lg font-axiforma font-semibold text-gray-900 mb-2">
            Ready to Start Your Recovery?
          </h3>
          <p className="text-body text-gray-600 leading-relaxed font-uber mb-6 max-w-md mx-auto">
            Choose the package that best suits your needs and begin your journey
            to better health.
          </p>
          <MyFillButton text="Book Consultation" link="/booking" />
        </motion.div> */}
      </div>
    </section>
  );
};

export default Pricing;
