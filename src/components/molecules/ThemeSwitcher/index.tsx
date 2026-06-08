"use client";

import { useTheme, Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { SunIcon } from "@/components/atoms/icons/sun.icon";
import { MoonIcon } from "@/components/atoms/icons/moon.icon";

export const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme("light");
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard Next.js anti-hydration-flash pattern
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      isIconOnly
      variant="ghost"
      size="sm"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onPress={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
    </Button>
  );
};
