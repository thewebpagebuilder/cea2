import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://chicoequestrianassociation.com"),
  title: {
    default: "Chico Equestrian Association | Bidwell Park, Chico CA",
    template: "%s | Chico Equestrian Association",
  },
  description:
    "CEA keeps horses in Bidwell Park: an interactive trail guide, rider-reported trail conditions, an equestrian business directory, events, and volunteer programs for the north valley horse community.",
  keywords: [
    "Chico Equestrian Association",
    "Bidwell Park horse trails",
    "Chico CA horseback riding",
    "equestrian business directory",
    "trail conditions",
  ],
  openGraph: {
    title: "Chico Equestrian Association",
    description:
      "Trail conditions, rides, and resources for the Bidwell Park horse community.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
