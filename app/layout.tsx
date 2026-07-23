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
      default: "Vishwesh Mashruwala — Portfolio",
      template: "%s — Vishwesh Mashruwala",
    },
    description: "Portfolio of Vishwesh Mashruwala, a self-employed software developer in India with interests in hardware, mechanics, visual work, and Mandarin.",
    applicationName: "Vishwesh Mashruwala",
    authors: [{ name: "Vishwesh Mashruwala" }],
    keywords: ["Vishwesh Mashruwala", "software developer", "hardware", "mechanical engineering", "video editing", "portfolio"],
    openGraph: {
      title: "Vishwesh Mashruwala — Portfolio",
      description: "Software is Vishwesh's main area, alongside ongoing interests in hardware, mechanics, visual work, and Mandarin.",
      type: "website",
      siteName: "Vishwesh Mashruwala",
      url: base,
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "Vishwesh Mashruwala portfolio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Vishwesh Mashruwala — Portfolio",
      description: "Software is Vishwesh's main area, alongside ongoing interests in hardware, mechanics, visual work, and Mandarin.",
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
