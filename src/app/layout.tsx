import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

// System font stack for minimal, privacy-conscious design
const fontSans = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const metadata: Metadata = {
  metadataBase: new URL("https://onehumaninitiative.org"),
  title: {
    default: "One Human Initiative",
    template: "%s | One Human Initiative",
  },
  description: "A privacy-conscious campaign to provide direct financial support to an anonymous individual. No tracking. No accounts. No compromise.",
  keywords: ["campaign", "fundraising", "privacy", "bitcoin", "solana", "phantom", "kofi"],
  authors: [{ name: "One Human Initiative" }],
  creator: "One Human Initiative",
  publisher: "One Human Initiative",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://onehumaninitiative.org",
    siteName: "One Human Initiative",
    title: "One Human Initiative",
    description: "A privacy-conscious campaign to provide direct financial support to an anonymous individual.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "One Human Initiative",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "One Human Initiative",
    description: "A privacy-conscious campaign to provide direct financial support to an anonymous individual.",
    images: ["/og-image.png"],
  },
  verification: {
    other: {
      "privacy-policy": "/privacy",
      "terms-of-service": "/terms",
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" style={{ fontFamily: fontSans }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-warm-white text-charcoal-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}