import { Outfit as OutfitFont, Ovo as OvoFont } from "next/font/google";
import "./globals.css";

const outfit = OutfitFont({
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: '--font-outfit',
});

const ovo = OvoFont({
  subsets: ["latin"], 
  weight: ["400"],
  variable: '--font-ovo',
});

export const metadata = {
  title: "Transport Service",
  description: "From Dubai to Abu Dhabi and from Abu Dhabi to Dubai, book your ride with us!",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${ovo.variable} font-outfit antialiased 
        leading-8 overflow-x-hidden w-full m-0 p-0 bg-white text-black dark:bg-darkTheme dark:text-white`}
      >
        {/* Wrapping children in a div that ensures 100% width */}
        <main className="w-full min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}