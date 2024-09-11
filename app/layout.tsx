import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import PrelineScript from "../components/preline-script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Equally",
  description: "Equally is a simple way to keep track of shared expenses.",
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
        className={`${inter.className} flex min-h-dvh pb-24 pt-16 dark:bg-neutral-900 dark:text-white`}
      >
        <main className="mx-auto max-w-lg grow px-4">{children}</main>
        <div className="fixed bottom-0 left-0 right-0 z-0 h-20 bg-gradient-to-t from-white dark:from-neutral-900"></div>
      </body>
      <PrelineScript />
    </html>
  );
}
