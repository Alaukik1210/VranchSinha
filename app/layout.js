import DotCursor from "@/components/site/DotCursor";
import { Caveat, Geist_Mono, Instrument_Serif, Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import LiquidGlassFilter from "@/components/LiquidGlassFilter";


// v3: Unbounded for display, Manrope for text.
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Small metadata labels only (roles, indexes, captions).
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Handwriting on the About polaroid.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});


// Mockup titles.
const instrument = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const DESCRIPTION = "Vranch Sinha is a product and brand designer. Always on brand, rarely on script. See selected work, leadership roles and references.";

// Tells search engines who this site is about, and which profiles are the same person.
const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vranch Sinha",
  jobTitle: "Product and brand designer",
  url: "https://vranchsinha.vercel.app",
  address: { "@type": "PostalAddress", addressLocality: "Gurgaon", addressRegion: "Haryana", addressCountry: "IN" },
  sameAs: ["https://www.linkedin.com/in/vranchsinha", "https://music.apple.com/profile/vranchsinha"],
};

export const metadata = {
  metadataBase: new URL("https://vranchsinha.vercel.app"),
  title: "Vranch Sinha | Product and brand designer",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: "Vranch Sinha", description: DESCRIPTION, url: "/", siteName: "Vranch Sinha", type: "website" },
  twitter: { card: "summary_large_image", title: "Vranch Sinha", description: DESCRIPTION },
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport = {
  themeColor: "#FFFEFC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${unbounded.variable}
          ${manrope.variable}
          ${geistMono.variable}
          ${caveat.variable}
          ${instrument.variable}
          antialiased
        `}
      >
        {/* The page's height settles after load, so a restored scroll lands in the wrong place. */}
        <script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration='manual'" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
        <LiquidGlassFilter />
        <SmoothScroll>{children}</SmoothScroll>
        <DotCursor />
      </body>
    </html>
  );
}

