"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ChevronDown, MapPin, Phone } from "lucide-react";
import { physiotherapyServices } from "../../data/services";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  const menuItems = [
    { label: "Contact", href: "/#contact" },
  ];

  const handleMenuClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);

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
      <div className="site-container">
        <div className="flex items-center justify-between py-3">
          {/* Logo Section */}
          <motion.a
            href="/"
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            aria-label="Easeway Medicare home"
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="relative">
                <img
                  src="/images/easeway_logo.png"
                  alt="Easeway Medicare Physiotherapy Clinic"
                  className="w-9 rounded-lg md:w-11"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-axiforma text-[17px] font-bold leading-tight text-[#0E2127]">
                  Easeway Medicare
                </p>
                <p className="font-uber text-[15px] text-[#0E2127]/70">
                  Physiotherapy Clinic
                </p>
              </div>
            </div>
          </motion.a>

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
          <nav className="hidden md:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
              onFocusCapture={() => setIsServicesOpen(true)}
              onBlurCapture={(event) => {
                const nextTarget = event.relatedTarget as Node | null;
                if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
                  setIsServicesOpen(false);
                }
              }}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isServicesOpen}
                onClick={() => setIsServicesOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-transparent px-0 py-2 font-uber text-[17px] font-medium text-[#0E2127] transition-colors hover:text-[#FF3133]"
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full z-50 w-[720px] max-w-[calc(100vw-2rem)] pt-4"
                  >
                    <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-2xl ring-1 ring-black/5">
                      <div className="flex items-center justify-between gap-6 border-b border-gray-100 bg-gray-50 px-5 py-4">
                        <div>
                          <p className="font-axiforma text-[17px] font-semibold text-[#0E2127]">
                            Physiotherapy Services
                          </p>
                          <p className="mt-1 font-uber text-[14px] text-gray-600">
                            Direct links for treatment, recovery, and booking
                            decisions.
                          </p>
                        </div>
                        <a
                          href="/services"
                          onClick={() => setIsServicesOpen(false)}
                          className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-[#0E2127] px-4 py-2.5 font-axiforma text-[14px] font-semibold text-white transition-colors hover:bg-[#18343d]"
                        >
                          All Services
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>

                      <div
                        role="menu"
                        className="grid max-h-[68vh] gap-2 overflow-y-auto p-3 sm:grid-cols-2"
                      >
                        {physiotherapyServices.map((service) => {
                          const Icon = service.icon;

                          return (
                            <a
                              key={service.slug}
                              href={`/services/${service.slug}`}
                              role="menuitem"
                              onClick={() => setIsServicesOpen(false)}
                              className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-[#FF3133]/5 focus:bg-[#FF3133]/5 focus:outline-none"
                            >
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FF3133]/10 text-[#FF3133] transition-colors group-hover:bg-[#FF3133] group-hover:text-white">
                                <Icon className="h-5 w-5" />
                              </span>
                              <span>
                                <span className="block font-axiforma text-[15px] font-semibold leading-snug text-[#0E2127]">
                                  {service.title}
                                </span>
                                <span className="mt-1 line-clamp-2 block font-uber text-[13px] leading-5 text-gray-600">
                                  {service.description}
                                </span>
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
                className="text-[17px] font-medium text-[#0E2127] transition-colors hover:text-[#FF3133]"
              >
                {item.label}
              </a>
            ))}

            <motion.a
              href="/booking"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-7 py-4"
            >
              Book Appointment
            </motion.a>
          </nav>

          {/* Hamburger Menu Button */}
          <motion.button
            onClick={() => {
              setIsMobileMenuOpen((isOpen) => {
                if (isOpen) {
                  setIsMobileServicesOpen(false);
                }
                return !isOpen;
              });
            }}
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
            <div className="site-container space-y-4 py-6">
              {/* Mobile Navigation */}
              <nav className="space-y-3">
                <div className="rounded-3xl border border-gray-200 bg-white">
                  <button
                    type="button"
                    aria-expanded={isMobileServicesOpen}
                    onClick={() =>
                      setIsMobileServicesOpen((isOpen) => !isOpen)
                    }
                    className="flex w-full items-center justify-between rounded-3xl bg-white px-4 py-4 text-left text-[17px] font-medium text-[#0E2127]"
                  >
                    Services
                    <ChevronDown
                      className={`h-5 w-5 text-[#FF3133] transition-transform ${
                        isMobileServicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isMobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 p-3">
                          <a
                            href="/services"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsMobileServicesOpen(false);
                            }}
                            className="mb-2 flex items-center justify-between rounded-2xl bg-[#0E2127] px-4 py-3 font-axiforma text-[16px] font-semibold text-white"
                          >
                            All Services
                            <ArrowRight className="h-4 w-4" />
                          </a>

                          <div className="grid gap-2">
                            {physiotherapyServices.map((service) => {
                              const Icon = service.icon;

                              return (
                                <a
                                  key={service.slug}
                                  href={`/services/${service.slug}`}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsMobileServicesOpen(false);
                                  }}
                                  className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-[#FF3133]/5"
                                >
                                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FF3133]/10 text-[#FF3133]">
                                    <Icon className="h-5 w-5" />
                                  </span>
                                  <span>
                                    <span className="block font-axiforma text-[15px] font-semibold leading-snug text-[#0E2127]">
                                      {service.title}
                                    </span>
                                    <span className="mt-1 line-clamp-2 block font-uber text-[13px] leading-5 text-gray-600">
                                      {service.description}
                                    </span>
                                  </span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
                    className="block w-full cursor-pointer px-1 py-2 text-left text-[17px] font-medium text-[#0E2127] transition-colors hover:text-[#FF3133]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* Mobile Contact Info */}
              <div className="pt-4 border-t border-[#0E2127]/10 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF3133]/10">
                    <Phone className="text-[#FF3133] w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-uber text-[15px] text-[#0E2127]/60">
                      Call us
                    </p>
                    <a
                      href="tel:+447460091561"
                      className="text-link text-[16px] font-semibold"
                    >
                      +44 7460 091561
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF3133]/10">
                    <MapPin className="text-[#FF3133] w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-uber text-[15px] text-[#0E2127]/60">
                      Location
                    </p>
                    <p className="font-uber text-[16px]">
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
                  className="btn-primary w-full"
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
