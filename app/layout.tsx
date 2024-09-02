import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import PrelineScript from "../components/PrelineScript";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fair Share",
  description: "Fair Share is a simple way to keep track of shared expenses.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-dvh pb-20 pt-16 dark:bg-neutral-900 dark:text-white`}
      >
        <main className="mx-auto max-w-lg grow px-4">{children}</main>
      </body>
      <PrelineScript />
    </html>
  );
}
