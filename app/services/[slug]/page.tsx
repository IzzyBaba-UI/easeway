import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import Footer from "../../../src/components/shared/Footer";
import Header from "../../../src/components/shared/Header";
import FaqAccordion from "../../../src/components/services/FaqAccordion";
import {
  getAllServiceSlugs,
  getRelatedServices,
  getServiceBySlug,
} from "../../../src/data/services";

type ServicePageProps = {
  params: {
    slug: string;
  };
};

const baseUrl = "https://www.easewaymedicare.co.uk";

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: "Physiotherapy Service",
      description:
        "Physiotherapy services from Easeway Medicare Physiotherapy Clinic in Whittlesey.",
    };
  }

  const canonicalUrl = `${baseUrl}/services/${service.slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: canonicalUrl,
      siteName: "Easeway Medicare Physiotherapy Clinic",
      images: [
        {
          url: `${baseUrl}${service.image}`,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
      images: [`${baseUrl}${service.image}`],
    },
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;
  const relatedServices = getRelatedServices(service.slug);
  const serviceUrl = `${baseUrl}/services/${service.slug}`;
  const bookingHref =
    service.slug === "acupuncture" ? "/booking?service=acupuncture" : "/booking";
  const bookingUrl = `${baseUrl}${bookingHref}`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Easeway Medicare Physiotherapy Clinic",
    url: baseUrl,
    telephone: "+447460091561",
    image: `${baseUrl}${service.image}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Manor Leisure Centre",
      postalCode: "PE7 1UA",
      addressLocality: "Whittlesey",
      addressRegion: "Peterborough",
      addressCountry: "GB",
    },
    medicalSpecialty: "Physiotherapy",
    makesOffer: {
      "@type": "Offer",
      url: serviceUrl,
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.metaDescription,
        areaServed: ["Whittlesey", "Peterborough"],
        provider: {
          "@type": "MedicalBusiness",
          name: "Easeway Medicare Physiotherapy Clinic",
        },
      },
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#EDF2F6]">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gray-950 text-white">
          <div className="absolute inset-0">
            <img
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/65" />
          </div>

          <div className="site-container relative flex min-h-[640px] flex-col justify-end pb-14 pt-24 sm:min-h-[720px]">
            <nav
              className="mb-7 flex flex-wrap items-center gap-2 text-[16px] text-gray-200"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="text-white hover:text-[#FF3133]">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href="/services"
                className="text-white hover:text-[#FF3133]"
              >
                Services
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-300">{service.title}</span>
            </nav>

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/25 bg-white/15 backdrop-blur">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h1 className="max-w-4xl font-axiforma text-[38px] font-bold leading-tight text-white sm:text-[50px]">
              {service.title}
            </h1>
            <p className="mt-5 max-w-2xl text-[19px] leading-8 text-gray-100">
              {service.heroTitle}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={bookingHref} className="btn-primary">
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Link>
              <Link href="/services" className="btn-outline-light">
                View All Services
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="site-container grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="max-w-3xl">
              <p className="section-eyebrow">Service Overview</p>
              
              <p className="mt-5 text-[18px] leading-8 text-gray-600">
                {service.intro}
              </p>
            </div>

            <aside className="rounded-lg border border-gray-200 bg-gray-50 p-5 shadow-sm">
              <h2 className="font-axiforma text-[20px] font-semibold text-gray-950">
                At a glance
              </h2>
              <div className="mt-5 flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF3133]" />
                <div>
                  <h3 className="font-axiforma text-[17px] font-semibold text-gray-950">
                    Session Information
                  </h3>
                  <p className="mt-2 text-[16px] leading-6 text-gray-600">
                    {service.sessionInfo}
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-gray-200 pt-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF3133]" />
                  <div>
                    <h3 className="font-axiforma text-[17px] font-semibold text-gray-950">
                      Clinic Location
                    </h3>
                    <p className="mt-2 text-[16px] leading-6 text-gray-600">
                      Manor Leisure Centre, PE7 1UA, Whittlesey,
                      Peterborough.
                    </p>
                  </div>
                </div>
              </div>
              {/* {service.slug === "acupuncture" && (
              )} */}
            </aside>
          </div>
        </section>

        <section className="bg-gray-50 py-14 sm:py-16">
          <div className="site-container">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="font-axiforma text-[26px] font-semibold text-gray-950">
                  Who it is for
                </h2>
                <div className="mt-6 divide-y divide-gray-200">
                  {service.bestFor.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF3133]" />
                      <p className="text-[17px] leading-7 text-gray-700">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="font-axiforma text-[26px] font-semibold text-gray-950">
                  What is included
                </h2>
                <div className="mt-6 divide-y divide-gray-200">
                  {service.included.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#FF3133]" />
                      <p className="text-[17px] leading-7 text-gray-700">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="section-eyebrow">Treatment Approach</p>
              <h2 className="section-title mt-3">
                How your appointment is structured
              </h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {service.process.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF3133] font-axiforma text-[16px] font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 font-axiforma text-[20px] font-semibold text-gray-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[17px] leading-7 text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-lg bg-gray-950 p-6 text-white sm:p-8">
              <h2 className="font-axiforma text-[26px] font-semibold text-white">
                Expected outcomes
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {service.outcomes.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF3133]" />
                    <p className="text-[17px] leading-7 text-gray-200">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-14 sm:py-16">
          <div className="site-container grid gap-8 lg:grid-cols-[0.45fr_0.55fr]">
            <div>
              <p className="section-eyebrow">Common Questions</p>
              <h2 className="section-title mt-3">{service.title} FAQs</h2>
              <p className="mt-4 max-w-md text-[17px] leading-7 text-gray-600">
                Quick answers to the questions clients usually ask before
                booking this service.
              </p>
            </div>
            <FaqAccordion faqs={service.faqs} />
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="site-container">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="section-eyebrow">Explore More</p>
                <h2 className="section-title mt-3">
                  Related physiotherapy services
                </h2>
              </div>
              <Link href="/services" className="text-link">
                All services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {relatedServices.map((related) => {
                const RelatedIcon = related.icon;

                return (
                  <Link
                    key={related.slug}
                    href={`/services/${related.slug}`}
                    className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF3133]/40 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FF3133]/10">
                      <RelatedIcon className="h-6 w-6 text-[#FF3133]" />
                    </div>
                    <h3 className="mt-5 font-axiforma text-[20px] font-semibold text-gray-950">
                      {related.title}
                    </h3>
                    <p className="mt-3 text-[16px] leading-6 text-gray-600">
                      {related.description}
                    </p>
                    <div className="text-link mt-5">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#FF3133] py-12 text-white sm:py-14">
          <div className="site-container flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-axiforma text-[30px] font-semibold leading-tight text-white sm:text-[36px]">
                Ready to discuss {service.title.toLowerCase()}?
              </h2>
              <p className="mt-3 max-w-2xl text-[18px] leading-7 text-white/90">
                Book an appointment or contact the clinic to check whether this
                service is suitable for your symptoms and goals.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={bookingHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-axiforma text-[16px] font-semibold leading-none text-[#FF3133] transition-colors hover:bg-gray-100 sm:py-4"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Link>
              <a href="tel:+447460091561" className="btn-outline-light">
                <Phone className="h-5 w-5" />
                Call Clinic
              </a>
            </div>
          </div>
        </section>

        <div className="bg-white py-8">
          <div className="site-container">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-axiforma text-[16px] font-semibold text-gray-700 transition-colors hover:text-[#FF3133]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all physiotherapy services
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
