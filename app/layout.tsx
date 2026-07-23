import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/dm-sans/standard.css";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og-minimal.png", base).toString();

  return {
    metadataBase: base,
    title: {
      default: "Vishwesh Mashruwala — Independent Maker",
      template: "%s — Vishwesh Mashruwala",
    },
    description: "Vishwesh Mashruwala builds software to understand ideas, while learning through hardware, mechanisms, visual craft, and Mandarin.",
    applicationName: "Vishwesh Mashruwala",
    authors: [{ name: "Vishwesh Mashruwala" }],
    keywords: ["Vishwesh Mashruwala", "software engineer", "hardware", "creative technologist", "portfolio"],
    openGraph: {
      title: "Vishwesh Mashruwala — Independent Maker",
      description: "Software is where Vishwesh builds today. Hardware, mechanisms, and visual craft expand how he tests and explains ideas.",
      type: "website",
      siteName: "Vishwesh Mashruwala",
      url: base,
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "Vishwesh Mashruwala — code, circuits, mechanisms, motion" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Vishwesh Mashruwala — Independent Maker",
      description: "Software is where Vishwesh builds today. Hardware, mechanisms, and visual craft expand how he tests and explains ideas.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
