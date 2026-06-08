import type { AppointmentStatus } from "@/types";
import { Badge } from "@/components/atoms/Badge";

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

export const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
  const config: Record<AppointmentStatus, { variant: "success" | "danger"; label: string }> = {
    Active: { variant: "success", label: "Active" },
    Cancelled: { variant: "danger", label: "Cancelled" },
  };
  const { variant, label } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
};
