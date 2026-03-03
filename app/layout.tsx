import type { Metadata } from "next";
import Script from "next/script";
import "../src/index.css";
import "../src/fonts.css";
import ClientProviders from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL || "easewaymedicare.co.uk"}`
  ),
  title: {
    default:
      "Easeway Medicare Physiotherapy Clinic - Professional Physiotherapy Services in Whittlesey",
    template: "%s | Easeway Medicare Physiotherapy Clinic",
  },
  description:
    "Overcome pain, regain mobility and live life to the fullest easily! Professional physiotherapy services including manual therapy, electrotherapy, sports massage and home physiotherapy care in Whittlesey, Peterborough.",
  keywords:
    "physiotherapy, physiotherapist, manual therapy, electrotherapy, sports massage, home physiotherapy, Whittlesey, Peterborough, pain relief, mobility, rehabilitation",
  authors: [{ name: "Easeway Medicare Physiotherapy Clinic" }],
  creator: "Easeway Medicare Physiotherapy Clinic",
  publisher: "Easeway Medicare Physiotherapy Clinic",
  icons: {
    icon: [
      { url: "/images/easeway_logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/easeway_logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/images/easeway_logo.png",
    apple: "/images/easeway_logo.png",
  },
  openGraph: {
    title: "Easeway Medicare Physiotherapy Clinic",
    description:
      "Professional physiotherapy services in Whittlesey, Peterborough",
    url: "https://easewaymedicare.co.uk",
    siteName: "Easeway Medicare Physiotherapy Clinic",
    images: [
      {
        url: "/images/easeway_logo.png",
        width: 800,
        height: 600,
        alt: "Easeway Medicare Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Easeway Medicare Physiotherapy Clinic",
    description:
      "Professional physiotherapy services in Whittlesey, Peterborough",
    images: ["/images/easeway_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "https://easewaymedicare.co.uk",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17918838357"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17918838357');
          `}
        </Script>
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
