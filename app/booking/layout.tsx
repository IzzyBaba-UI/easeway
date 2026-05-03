import type { Metadata } from "next";

const baseUrl = "https://www.easewaymedicare.co.uk";

export const metadata: Metadata = {
  title: "Book a Physiotherapy Appointment",
  description:
    "Book a physiotherapy appointment with Easeway Medicare in Whittlesey, including clinic physiotherapy, sports massage, acupuncture, virtual consultation, and home visit options.",
  keywords: [
    "book physiotherapy Whittlesey",
    "book acupuncture Whittlesey",
    "book sports massage Peterborough",
    "physiotherapy appointment",
  ],
  alternates: {
    canonical: `${baseUrl}/booking`,
  },
  openGraph: {
    title: "Book a Physiotherapy Appointment",
    description:
      "Schedule physiotherapy, sports massage, acupuncture, virtual consultation, or home physiotherapy care with Easeway Medicare.",
    url: `${baseUrl}/booking`,
    siteName: "Easeway Medicare Physiotherapy Clinic",
    images: [
      {
        url: `${baseUrl}/images/easeway_logo.png`,
        width: 800,
        height: 600,
        alt: "Easeway Medicare Physiotherapy Clinic",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Physiotherapy Appointment",
    description:
      "Schedule physiotherapy, sports massage, acupuncture, virtual consultation, or home visit care.",
    images: [`${baseUrl}/images/easeway_logo.png`],
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
