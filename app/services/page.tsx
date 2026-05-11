import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, MapPin } from "lucide-react";
import Footer from "../../src/components/shared/Footer";
import Header from "../../src/components/shared/Header";
import { physiotherapyServices } from "../../src/data/services";

const baseUrl = "https://www.easewaymedicare.co.uk";

export const metadata: Metadata = {
  title: "Professional Physiotherapy Services in Whittlesey",
  description:
    "Explore Easeway Medicare's physiotherapy services in Whittlesey, including sports massage, acupuncture, manual therapy, post-surgical rehabilitation, home physiotherapy, and more.",
  keywords: [
    "physiotherapy services Whittlesey",
    "physiotherapy Peterborough",
    "sports massage Whittlesey",
    "acupuncture Whittlesey",
    "post surgical rehabilitation",
    "home physiotherapy",
  ],
  alternates: {
    canonical: `${baseUrl}/services`,
  },
  openGraph: {
    title: "Professional Physiotherapy Services in Whittlesey",
    description:
      "Individual physiotherapy service pages for pain relief, rehabilitation, sports massage, acupuncture, home visits, and recovery support.",
    url: `${baseUrl}/services`,
    siteName: "Easeway Medicare Physiotherapy Clinic",
    images: [
      {
        url: `${baseUrl}/images/fx5.jpg`,
        width: 1200,
        height: 630,
        alt: "Easeway Medicare physiotherapy services",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Physiotherapy Services in Whittlesey",
    description:
      "Browse sports massage, acupuncture, manual therapy, rehabilitation, and home physiotherapy services from Easeway Medicare.",
    images: [`${baseUrl}/images/fx5.jpg`],
  },
};

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EDF2F6]">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gray-950 text-white">
          <div className="absolute inset-0">
            <img
              src="/images/fx5.jpg"
              alt="Physiotherapy assessment at Easeway Medicare"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/65" />
          </div>

          <div className="site-container relative flex min-h-[640px] flex-col justify-end pb-14 pt-24 sm:min-h-[720px]">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-uber text-[16px] text-white backdrop-blur">
              <MapPin className="h-4 w-4 text-[#FF3133]" />
              Whittlesey and Peterborough physiotherapy care
            </div>
            <h1 className="max-w-4xl font-axiforma text-[38px] font-bold leading-tight text-white sm:text-[50px]">
              Professional Physiotherapy Services
            </h1>
            <p className="mt-5 max-w-2xl text-[19px] leading-8 text-gray-100">
              Choose a dedicated service page for clear information on
              assessment, treatment options, rehabilitation support, and how
              Easeway Medicare can help you move with more confidence.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/booking" className="btn-primary">
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Link>
              <Link href="/#contact" className="btn-outline-light">
                Contact Clinic
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="section-eyebrow">Service Directory</p>
             
              <p className="mt-4 max-w-2xl text-[18px] leading-7 text-gray-600">
                Each service page explains who the treatment is for, what is
                included, what to expect, and common questions clients ask
                before booking.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {physiotherapyServices.map((service) => {
                const Icon = service.icon;

                return (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF3133]/40 hover:shadow-md"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-white/25 backdrop-blur">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-axiforma text-[18px] font-semibold leading-snug text-gray-950">
                        {service.title}
                      </h3>
                      <p className="mt-3 flex-1 text-[16px] leading-6 text-gray-600">
                        {service.description}
                      </p>
                      <div className="text-link mt-5">
                        Read service details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-14 sm:py-16">
          <div className="site-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="section-eyebrow">Why choose Easeway Medicare</p>
              <h2 className="section-title mt-3">
                Care that connects diagnosis, treatment, and rehabilitation
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Clear explanation of symptoms and recovery options",
                "Treatment plans tailored to daily life, work, and activity goals",
                "Hands-on care, exercise rehabilitation, and practical advice",
                "Clinic, virtual, and home physiotherapy options where suitable",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF3133]" />
                  <p className="text-[16px] leading-7 text-gray-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
