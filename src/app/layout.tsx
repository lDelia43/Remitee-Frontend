import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sweet Medical",
    template: "%s | Sweet Medical",
  },
  description: "Medical Appointment Management System",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
      <QueryProvider>{children}</QueryProvider>
    </body>
  </html>
);

export default RootLayout;
