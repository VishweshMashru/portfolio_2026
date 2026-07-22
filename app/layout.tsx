import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

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
    description: "The multidisciplinary practice of Vishwesh Mashruwala: software, hardware, mechanisms, visuals, and learning in public.",
    applicationName: "Vishwesh Mashruwala",
    authors: [{ name: "Vishwesh Mashruwala" }],
    keywords: ["Vishwesh Mashruwala", "software engineer", "hardware", "creative technologist", "portfolio"],
    openGraph: {
      title: "Vishwesh Mashruwala — Independent Maker",
      description: "Code, circuits, mechanisms, motion — and the curiosity connecting them.",
      type: "website",
      siteName: "Vishwesh Mashruwala",
      url: base,
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "Vishwesh Mashruwala — code, circuits, mechanisms, motion" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Vishwesh Mashruwala — Independent Maker",
      description: "Code, circuits, mechanisms, motion — and the curiosity connecting them.",
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
