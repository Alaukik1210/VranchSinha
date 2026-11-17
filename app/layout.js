import DotCursor from "@/components/site/DotCursor";
import { Caveat, Geist_Mono, Instrument_Serif, Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import Resume from "@/components/Resume";
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
  openGraph: { title: "Vranch Sinha | Product and brand designer", description: DESCRIPTION, url: "/", siteName: "Vranch Sinha", type: "website" },
  twitter: { card: "summary_large_image", title: "Vranch Sinha | Product and brand designer", description: DESCRIPTION },
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
        {/* A refresh always starts at the top with the intro, even after Contact left
            #contact in the address. The page is held still from the first byte; the
            intro lets go when it ends, or straight away if it won't play.
            The exception is a reload nobody asked for: a phone browser, an in-app one
            most of all, can drop a page to free memory and load it again. No pagehide
            came before it, so the visitor is put back where they were, without the intro. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "history.scrollRestoration='manual';var n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0],R=null;try{var s=JSON.parse(sessionStorage.getItem('vs:spot')||'null');if(n&&n.type==='reload'&&!sessionStorage.getItem('vs:left')&&s&&s.p===location.pathname&&Date.now()-s.t<18e5)R=s;sessionStorage.removeItem('vs:left')}catch(e){}window.__resume=R;addEventListener('pagehide',function(){try{sessionStorage.setItem('vs:left','1')}catch(e){}});var q=0;addEventListener('scroll',function(){if(q)return;q=setTimeout(function(){q=0;try{var b=document.querySelector('.bill');sessionStorage.setItem('vs:spot',JSON.stringify({p:location.pathname,y:Math.round(scrollY),b:b&&!b.classList.contains('is-film')&&b.getBoundingClientRect().top<innerHeight/2?1:0,t:Date.now()}))}catch(e){}},400)},{passive:true});if(!R&&n&&n.type==='reload'&&location.hash)history.replaceState(null,'',location.pathname+location.search);if(!R&&location.pathname==='/'&&!location.hash&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('is-intro');setTimeout(function(){document.documentElement.classList.remove('is-intro')},20000)}",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
        <LiquidGlassFilter />
        <SmoothScroll>{children}</SmoothScroll>
        <Resume />
        <DotCursor />
      </body>
    </html>
  );
}

