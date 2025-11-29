
import { Funnel_Display, Outfit } from "next/font/google";
import "./globals.css";



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
  title: "Vranch sinha",
  description: "vranch sinha portfolio",
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
        {children}
      </body>
    </html>
  );
}

