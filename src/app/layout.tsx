import type { Metadata, Viewport } from "next";
import "@fontsource/libre-caslon-display/400.css";
import "@fontsource/libre-caslon-text/400.css";
import "@fontsource/libre-caslon-text/400-italic.css";
import "@fontsource/libre-caslon-text/700.css";
import "@fontsource/baskervville/400.css";
import "@fontsource/baskervville/400-italic.css";
import "@fontsource/baskervville/500.css";
import "@fontsource/baskervville/600.css";
import "@fontsource/baskervville/700.css";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/400-italic.css";
import "@fontsource/libre-baskerville/700.css";
import "@fontsource-variable/inter";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import { brand, contact, SITE_URL } from "@/content/site";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Reveal from "@/components/motion/Reveal";
import Cursor from "@/components/motion/Cursor";
import InquiryProvider from "@/components/inquiry/InquiryProvider";
import { StoryProvider } from "@/components/portfolio/StoryProvider";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Studio Kunal Photography — Documentary & Editorial Wedding Photography, North America & India",
    template: "%s · Studio Kunal Photography",
  },
  description: brand.metaDescription,
  keywords: [
    "Studio Kunal Photography",
    "Wedding Photography",
    "Wedding Cinematography",
    "Documentary Wedding Photography",
    "Editorial Wedding Photography",
    "Cinematic Wedding Photography",
    "North America",
    "India",
    "Destination Weddings",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: brand.name,
    title: brand.headline,
    description: brand.statements.intro,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: brand.headline,
    description: brand.statements.intro,
  },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: brand.name,
  url: SITE_URL,
  email: contact.email,
  description: brand.statements.intro,
  areaServed: ["North America", "India"],
  sameAs: [contact.instagram, contact.youtube],
  knowsAbout: ["Wedding Photography", "Wedding Cinematography", "Destination Weddings"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <Reveal />
        <Cursor />
        <InquiryProvider>
          <StoryProvider>
            {children}
          </StoryProvider>
        </InquiryProvider>
        <div className="grain" aria-hidden="true" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
