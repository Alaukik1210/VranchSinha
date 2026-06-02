import { Funnel_Display, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import LiquidGlassFilter from "@/components/LiquidGlassFilter";


const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});


export const metadata = {
  title: "Vranch Sinha — Portfolio",
  description:
    "Vranch Sinha — designer crafting digital experiences and brand identities.",
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport = {
  themeColor: "#0E0E0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${funnelDisplay.variable}
          ${outfit.variable}
          antialiased
        `}
      >
        <LiquidGlassFilter />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

