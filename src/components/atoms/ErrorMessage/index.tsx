import { Button } from "@heroui/react";
import { Typography } from "../Typography";
import { WarningTriangleIcon } from "../icons/warningTriangle.icon";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "color-mix(in oklab, var(--danger) 12%, transparent)", color: "var(--danger)" }}
    >
      <WarningTriangleIcon className="w-6 h-6" />
    </div>
    <div className="space-y-1">
      <Typography variant="h4" className="text-[--muted]">
        Something went wrong
      </Typography>
      <Typography variant="body-sm" className="text-[--muted] max-w-sm mx-auto opacity-70">
        {message}
      </Typography>
    </div>
    {onRetry && (
      <Button variant="ghost" size="sm" onPress={onRetry}>
        Try again
      </Button>
    )}
  </div>
);
