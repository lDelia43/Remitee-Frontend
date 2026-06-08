import { Navbar } from "@/components/organisms/Navbar";
import { ToastProvider } from "@heroui/react";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => (
  <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
    <ToastProvider placement="top end" />
    <Navbar />
    <main className="page-container section-gap">{children}</main>
  </div>
);
