import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { Metadata } from "next";

import { cn } from "../lib/utils";
import React from "react";
import Provider from "./Provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "NovelSync",
  description: "A collaborative writing platform for novelists.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
