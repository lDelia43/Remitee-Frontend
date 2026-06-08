"use client";

import { Button } from "@heroui/react";
import { Typography } from "@/components/atoms/Typography";
import { WarningTriangleIcon } from "@/components/atoms/icons/warningTriangle.icon";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center flex flex-col gap-4 max-w-sm">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
          style={{
            backgroundColor: "color-mix(in oklab, var(--danger) 12%, transparent)",
            color: "var(--danger)",
          }}
        >
          <WarningTriangleIcon className="w-7 h-7" strokeWidth={1.8} />
        </div>
        <div>
          <Typography variant="h3">Something went wrong</Typography>
          <Typography variant="body-sm" className="text-[--muted] mt-1">
            {error.message || "An unexpected error occurred."}
          </Typography>
        </div>
        <Button variant="outline" onPress={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
