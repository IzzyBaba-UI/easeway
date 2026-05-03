"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24">
      <div className="w-full">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/40 px-4 py-2 backdrop-blur-md sm:mb-8 sm:px-6">
              <span className="flex items-center gap-2 text-[15px] font-semibold text-gray-700">
                <Mail className="h-4 w-4" /> Get in Touch
              </span>
            </div>
            <h2 className="mb-6 font-axiforma text-[30px] tracking-tight text-gray-900 sm:mb-8 sm:text-[36px]">
              Contact Us
            </h2>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="mb-6 font-axiforma text-[24px] text-gray-900 sm:mb-8 sm:text-[26px]">
                Get In Touch
              </h3>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-white/40 backdrop-blur-md sm:h-12 sm:w-12">
                    <Phone className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-axiforma text-[18px] text-gray-900">
                      Phone
                    </h4>
                    <a
                      href="tel:+447460091561"
                      className="text-link text-[16px]"
                    >
                      +44 7460 091561
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-white/40 backdrop-blur-md sm:h-12 sm:w-12">
                    <Mail className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-axiforma text-[18px] text-gray-900">
                      Email
                    </h4>
                    <a
                      href="mailto:easeway.physiotherapy@easewaymedicare.co.uk"
                      className="text-link break-all text-[16px]"
                    >
                      easeway.physiotherapy@easewaymedicare.co.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-white/40 backdrop-blur-md sm:h-12 sm:w-12">
                    <MapPin className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-axiforma text-[18px] text-gray-900">
                      Location
                    </h4>
                    <p className="font-uber text-[16px] leading-7 text-gray-600">
                      Manor Leisure Centre
                      <br />
                      PE7 1UA, Whittlesey
                      <br />
                      Peterborough
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* QR Code Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center flex flex-col items-center space-y-6"
          >
            <h3 className="mb-8 font-axiforma text-[24px] text-gray-900 sm:text-[26px]">
              Online Booking
            </h3>

            <div className="max-w-sm mx-auto">
              <button
                onClick={() => (window.location.href = "/booking")}
                className="btn-primary flex h-12 w-full items-center justify-center"
              >
                <span>Book Now</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
