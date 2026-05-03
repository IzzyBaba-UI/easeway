"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Phone, MapPin } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/#contact" },
  ];

  const handleMenuClick = (href: string) => {
    setIsMobileMenuOpen(false);

    setTimeout(() => {
      if (href.startsWith("/#")) {
        if (window.location.pathname !== "/") {
          window.location.href = href;
          return;
        }

        scrollToSection(href.slice(1));
        return;
      }

      if (href.startsWith("#")) {
        scrollToSection(href);
        return;
      }

      window.location.href = href;
    }, 100);
  };

  const scrollToSection = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      const headerHeight = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.header
      className="w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo Section */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="relative">
                <img
                  src="/images/easeway_logo.png"
                  alt="Easeway Medicare Physiotherapy Clinic"
                  className="w-8 md:w-10 rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-[#0E2127] font-axiforma font-bold text-body leading-tight">
                  Easeway Medicare
                </p>
                <p className="text-[#0E2127]/70 text-body font-uber">
                  Physiotherapy Clinic
                </p>
              </div>
            </div>
          </motion.div>

          {/* 
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-[#0E2127]">
                  <div className="w-8 h-8 bg-[#FF3133]/10 rounded-full flex items-center justify-center">
                    <Phone className="text-[#FF3133] w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#0E2127]/60 text-body-xs font-uber">
                      Call us
                    </span>
                    <a
                      href="tel:+447460091561"
                      className="text-[#FF3133] font-axiforma font-semibold text-body-xs hover:text-[#e62a2c] transition-colors"
                    >
                      +44 7460 091561
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[#0E2127]">
                  <div className="w-8 h-8 bg-[#FF3133]/10 rounded-full flex items-center justify-center">
                    <MapPin className="text-[#FF3133] w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#0E2127]/60 text-body-xs font-uber">
                      Location
                    </span>
                    <span className="text-body-xs font-uber">
                      Whittlesey, Peterborough
                    </span>
                  </div>
                </div>
              </div>

          <div className="flex items-center gap-4">
                {!isLoading && (
                  <>
                    {isAuthenticated ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#FF3133]/10 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-[#FF3133]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base text-[#0E2127] font-medium">
                              {user?.name}
                            </span>
                            <span className="text-base text-[#0E2127]/60 capitalize">
                              {user?.role}
                            </span>
                          </div>
                        </div>

                        {user?.role === "admin" && (
                          <Link
                            href="/admin"
                            className="text-base bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            Admin
                          </Link>
                        )}

                        <button
                          onClick={() => signOut()}
                          className="p-2 text-[#0E2127]/60 hover:text-[#FF3133] transition-colors"
                          title="Sign out"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => signIn()}
                        className="flex items-center gap-2 text-[#ffffff]/80 hover:text-[#FF3133] transition-colors font-normal text-base"
                      >
                        <User className="w-4 h-4" />
                        Sign In
                      </button>
                    )}
                  </>
                )}

                <motion.a
                  href="/booking"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#FF3133] text-white px-4 py-2 rounded-lg text-body-sm font-axiforma hover:bg-[#e62a2c] transition-colors"
                >
                  Book Appointment
                </motion.a>
              </div>
            </div>
             */}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith("#") || item.href.startsWith("/#")) {
                    e.preventDefault();
                    handleMenuClick(item.href);
                  }
                }}
                className="text-[#0E2127] hover:text-[#FF3133] transition-colors text-base font-medium"
              >
                {item.label}
              </a>
            ))}

            <motion.a
              href="/booking"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FF3133] text-white px-4 py-2 rounded-lg text-body-sm font-axiforma hover:bg-[#e62a2c] transition-colors"
            >
              Book Appointment
            </motion.a>
          </nav>

          {/* Hamburger Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-transparent text-[#0E2127] transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                className="block h-0.5 bg-[#0E2127] rounded"
                animate={
                  isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-0.5 bg-[#0E2127] rounded"
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-0.5 bg-[#0E2127] rounded"
                animate={
                  isMobileMenuOpen
                    ? { rotate: -45, y: -8 }
                    : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.button>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="bg-white/95 backdrop-blur-md border-t border-white/20"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-10 py-6 space-y-4">
              {/* Mobile Navigation */}
              <nav className="space-y-3">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        item.href.startsWith("#") ||
                        item.href.startsWith("/#")
                      ) {
                        e.preventDefault();
                        handleMenuClick(item.href);
                      } else {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className="block w-full text-left text-[#0E2127] hover:text-[#FF3133] transition-colors text-base font-medium py-2 cursor-pointer"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* Mobile Contact Info */}
              <div className="pt-4 border-t border-[#0E2127]/10 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#FF3133]/10 rounded-full flex items-center justify-center">
                    <Phone className="text-[#FF3133] w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[#0E2127]/60 text-body font-uber">
                      Call us
                    </p>
                    <a
                      href="tel:+447460091561"
                      className="text-[#FF3133] font-semibold text-base hover:text-[#e62a2c] transition-colors"
                    >
                      +44 7460 091561
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#FF3133]/10 rounded-full flex items-center justify-center">
                    <MapPin className="text-[#FF3133] w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[#0E2127]/60 text-body font-uber">
                      Location
                    </p>
                    <p className="text-body font-uber">
                      Whittlesey, Peterborough
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Book Appointment Button */}
              <div className="pt-4">
                <motion.a
                  href="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full bg-[#FF3133] text-white px-4 py-3 rounded-lg text-center text-base font-axiforma hover:bg-[#e62a2c] transition-colors"
                >
                  Book Appointment
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
