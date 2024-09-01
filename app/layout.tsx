import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PrelineScript from "../components/PrelineScript";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fair Share",
  description: "Fair Share is a simple way to keep track of shared expenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-20 pt-16 dark:bg-neutral-900 dark:text-white`}
      >
        <main className="grow">{children}</main>
      </body>
      <PrelineScript />
    </html>
  );
}
