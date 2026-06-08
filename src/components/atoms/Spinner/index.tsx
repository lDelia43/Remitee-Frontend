import { Spinner as HeroSpinner } from "@heroui/react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => (
  <HeroSpinner size={size} className={className} />
);
