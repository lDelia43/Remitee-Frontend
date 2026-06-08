"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/molecules/ThemeSwitcher";
import { ClipboardDocumentListIcon } from "@/components/atoms/icons/clipboardDocumentList.icon";
import { ROUTES } from "@/constants";

const navItems = [
  { href: ROUTES.DASHBOARD, label: "Dashboard" },
  { href: ROUTES.DOCTORS, label: "Doctors" },
  { href: ROUTES.APPOINTMENTS, label: "Appointments" },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        borderBottom: "1px solid var(--border)",
        backgroundColor: "color-mix(in oklab, var(--background) 85%, transparent)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
            >
              <ClipboardDocumentListIcon className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Sweet Medical</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isActive
                      ? "color-mix(in oklab, var(--accent) 12%, transparent)"
                      : "transparent",
                    color: isActive ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <ThemeSwitcher />
      </div>

      <div className="sm:hidden" style={{ borderTop: "1px solid var(--border)" }}>
        <nav className="page-container flex items-center gap-1 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 text-center px-2 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: isActive
                    ? "color-mix(in oklab, var(--accent) 12%, transparent)"
                    : "transparent",
                  color: isActive ? "var(--accent)" : "var(--muted)",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
