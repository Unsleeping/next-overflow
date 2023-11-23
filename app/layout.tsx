import * as React from "react";
import type { Metadata } from "next";

import "./globals.css";
import Providers from "./providers";
import fontCls from "./fonts";

export const metadata: Metadata = {
  title: "NextOverflow",
  description:
    "A comminity-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, software engineering, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fontCls}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
