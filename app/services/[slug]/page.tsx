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

          <div className="relative mx-auto flex min-h-[540px] max-w-6xl flex-col justify-end px-4 pb-12 pt-24 sm:px-6 lg:px-8">
            <nav
              className="mb-7 flex flex-wrap items-center gap-2 text-body-sm text-gray-200"
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

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-white/25 bg-white/15 backdrop-blur">
              <Icon className="h-7 w-7 text-white" />
            </div>
            <h1 className="max-w-4xl font-axiforma text-h1-mobile font-bold leading-tight text-white sm:text-h1-desktop">
              {service.title}
            </h1>
            <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-gray-100">
              {service.heroTitle}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF3133] px-5 py-3 text-button-lg font-axiforma text-white transition-colors hover:bg-[#e62a2c]"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-button-lg font-axiforma text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                View All Services
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <div>
              <p className="text-body-sm font-axiforma font-semibold uppercase tracking-[0.12em] text-[#FF3133]">
                Service Overview
              </p>
              <h2 className="mt-3 font-axiforma text-h2-mobile font-semibold text-gray-950 sm:text-h2-small">
                What this service helps with
              </h2>
              <p className="mt-4 text-body leading-relaxed text-gray-600">
                {service.intro}
              </p>
            </div>

            <aside className="rounded-lg border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF3133]" />
                <div>
                  <h2 className="font-axiforma text-h6-desktop font-semibold text-gray-950">
                    Session Information
                  </h2>
                  <p className="mt-2 text-body-sm leading-relaxed text-gray-600">
                    {service.sessionInfo}
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-gray-200 pt-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF3133]" />
                  <div>
                    <h2 className="font-axiforma text-h6-desktop font-semibold text-gray-950">
                      Clinic Location
                    </h2>
                    <p className="mt-2 text-body-sm leading-relaxed text-gray-600">
                      Manor Leisure Centre, PE7 1UA, Whittlesey,
                      Peterborough.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-gray-50 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="font-axiforma text-h2-mobile font-semibold text-gray-950 sm:text-h2-small">
                  Who it is for
                </h2>
                <div className="mt-6 grid gap-3">
                  {service.bestFor.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4"
                    >
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF3133]" />
                      <p className="text-body-sm leading-relaxed text-gray-700">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-axiforma text-h2-mobile font-semibold text-gray-950 sm:text-h2-small">
                  What is included
                </h2>
                <div className="mt-6 grid gap-3">
                  {service.included.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4"
                    >
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#FF3133]" />
                      <p className="text-body-sm leading-relaxed text-gray-700">
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
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-body-sm font-axiforma font-semibold uppercase tracking-[0.12em] text-[#FF3133]">
                Treatment Approach
              </p>
              <h2 className="mt-3 font-axiforma text-h2-mobile font-semibold text-gray-950 sm:text-h2-small">
                How your appointment is structured
              </h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {service.process.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-lg border border-gray-200 bg-white p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF3133] font-axiforma text-button text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 font-axiforma text-h5-desktop font-semibold text-gray-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-body-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-lg bg-gray-950 p-6 text-white sm:p-8">
              <h2 className="font-axiforma text-h3-mobile font-semibold text-white sm:text-h3-small">
                Expected outcomes
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {service.outcomes.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF3133]" />
                    <p className="text-body-sm leading-relaxed text-gray-200">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-14 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-body-sm font-axiforma font-semibold uppercase tracking-[0.12em] text-[#FF3133]">
              Common Questions
            </p>
            <h2 className="mt-3 font-axiforma text-h2-mobile font-semibold text-gray-950 sm:text-h2-small">
              {service.title} FAQs
            </h2>
            <div className="mt-8 space-y-4">
              {service.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-gray-200 bg-white p-5"
                >
                  <h3 className="font-axiforma text-h6-desktop font-semibold text-gray-950">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-body-sm leading-relaxed text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-body-sm font-axiforma font-semibold uppercase tracking-[0.12em] text-[#FF3133]">
                  Explore More
                </p>
                <h2 className="mt-3 font-axiforma text-h2-mobile font-semibold text-gray-950 sm:text-h2-small">
                  Related physiotherapy services
                </h2>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-button font-axiforma text-[#FF3133]"
              >
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
                    className="group rounded-lg border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF3133]/40 hover:shadow-lg"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FF3133]/10">
                      <RelatedIcon className="h-6 w-6 text-[#FF3133]" />
                    </div>
                    <h3 className="mt-5 font-axiforma text-h5-desktop font-semibold text-gray-950">
                      {related.title}
                    </h3>
                    <p className="mt-3 text-body-sm leading-relaxed text-gray-600">
                      {related.description}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-button font-axiforma text-[#FF3133]">
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
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <h2 className="font-axiforma text-h2-mobile font-semibold text-white sm:text-h2-small">
                Ready to discuss {service.title.toLowerCase()}?
              </h2>
              <p className="mt-3 max-w-2xl text-body leading-relaxed text-white/90">
                Book an appointment or contact the clinic to check whether this
                service is suitable for your symptoms and goals.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-button-lg font-axiforma text-[#FF3133] transition-colors hover:bg-gray-100"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Link>
              <a
                href="tel:+447460091561"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-button-lg font-axiforma text-white transition-colors hover:bg-white/10"
              >
                <Phone className="h-5 w-5" />
                Call Clinic
              </a>
            </div>
          </div>
        </section>

        <div className="bg-white py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-button font-axiforma text-gray-700 transition-colors hover:text-[#FF3133]"
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
