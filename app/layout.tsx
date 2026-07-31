import type { Metadata, Viewport } from "next";
import { Barlow_Condensed } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";
import OnboardingOverlay from "@/components/Onboarding/OnboardingOverlay";

const barlowCondensed = Barlow_Condensed({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sofiaPro = localFont({
  src: [
    { path: "../public/fonts/SofiaProRegular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/SofiaProMedium.ttf",  weight: "500", style: "normal" },
    { path: "../public/fonts/SofiaProBold.ttf",    weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WKOUT",
  description: "Your daily workout planner.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WKOUT",
  },
};

export const viewport: Viewport = {
  themeColor: "#D1E231",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${sofiaPro.variable}`}>
      <body className="font-[family-name:var(--font-body)] antialiased bg-[#0F0F0F] text-[#F0EDE6]">
        {children}
        <AgentationProvider />
        <OnboardingOverlay />
      </body>
    </html>
  );
}
