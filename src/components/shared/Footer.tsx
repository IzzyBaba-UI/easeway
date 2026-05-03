"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/#contact" },
    { label: "Book Now", href: "/booking" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black border-t border-gray-800/50">
      <div className="site-container">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-14 md:py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <motion.div
              className="flex flex-col items-start mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-2">
                <img
                  src="/images/logo.png"
                  alt="Easeway Medicare Physiotherapy Clinic"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg mr-3"
                />
              </div>
              <div>
                <h3 className="font-axiforma text-[20px] text-white">
                  Easeway Medicare
                </h3>
                <p className="font-uber text-[16px] text-gray-400">
                  Physiotherapy Clinic
                </p>
              </div>
            </motion.div>

            <motion.p
              className="mb-6 max-w-sm font-uber text-[16px] leading-7 text-gray-400 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Professional physiotherapy services helping you overcome pain,
              regain mobility, and return to your active lifestyle.
            </motion.p>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h4
              className="mb-4 font-axiforma text-[18px] text-white sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Quick Links
            </motion.h4>
            <motion.ul
              className="space-y-2 sm:space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="block font-uber text-[16px] font-light text-gray-400 transition-all duration-300 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <motion.h4
              className="mb-4 font-axiforma text-[18px] text-white sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Contact
            </motion.h4>
            <motion.div
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-gray-800 rounded-lg flex items-center justify-center mt-0.5">
                  <Phone className="text-gray-400 w-3 h-3" />
                </div>
                <div>
                  <a
                    href="tel:+447460091561"
                    className="text-[16px] font-medium text-white transition-colors hover:text-gray-300"
                  >
                    +44 7460 091561
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-gray-800 rounded-lg flex items-center justify-center mt-0.5">
                  <Mail className="text-gray-400 w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href="mailto:easeway.physiotherapy@easewaymedicare.co.uk"
                    className="break-all text-[16px] font-light text-white transition-colors hover:text-gray-300"
                  >
                    easeway.physiotherapy@easewaymedicare.co.uk
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-gray-800 rounded-lg flex items-center justify-center mt-0.5">
                  <MapPin className="text-gray-400 w-3 h-3" />
                </div>
                <div>
                  <p className="font-uber text-[16px] font-light leading-7 text-white">
                    Manor Leisure Centre
                    <br />
                    PE7 1UA, Whittlesey
                    <br />
                    Peterborough
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-gray-800 rounded-lg flex items-center justify-center mt-0.5">
                  <Globe className="text-gray-400 w-3 h-3" />
                </div>
                <div>
                  <a
                    href="https://www.easewaymedicare.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-uber text-[16px] font-light text-white transition-colors hover:text-gray-300"
                  >
                    www.easewaymedicare.co.uk
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-800/50 py-4 sm:py-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="px-4 font-uber text-[15px] font-light text-gray-500">
            &copy; {new Date().getFullYear()} Easeway Medicare Physiotherapy
            Clinic. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
