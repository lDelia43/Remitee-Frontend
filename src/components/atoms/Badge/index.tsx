import { Chip } from "@heroui/react";

type BadgeVariant = "primary" | "success" | "warning" | "danger" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
}

const variantToColor: Record<BadgeVariant, "accent" | "success" | "warning" | "danger" | "default"> = {
  primary: "accent",
  success: "success",
  warning: "warning",
  danger: "danger",
  default: "default",
};

export const Badge = ({ children, variant = "default", size = "sm" }: BadgeProps) => (
  <Chip color={variantToColor[variant]} size={size} variant="soft">
    {children}
  </Chip>
);
