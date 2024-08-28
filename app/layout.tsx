import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    <html lang="en" className="h-full">
      <body className={`${inter.className} mx-auto max-w-lg px-4 pb-20 pt-16`}>
        <header>{/* TODO: add Navigation */}</header>
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
