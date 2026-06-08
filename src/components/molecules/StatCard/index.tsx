import { Card, Skeleton } from "@heroui/react";
import { Typography } from "@/components/atoms/Typography";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "default";
  isLoading?: boolean;
}

const colorStyles: Record<string, { bg: string; fg: string }> = {
  primary: { bg: "color-mix(in oklab, var(--accent) 12%, transparent)", fg: "var(--accent)" },
  success: { bg: "color-mix(in oklab, var(--success) 12%, transparent)", fg: "var(--success)" },
  warning: { bg: "color-mix(in oklab, var(--warning) 12%, transparent)", fg: "var(--warning)" },
  danger: { bg: "color-mix(in oklab, var(--danger) 12%, transparent)", fg: "var(--danger)" },
  default: { bg: "var(--default)", fg: "var(--foreground)" },
};

export const StatCard = ({
  title,
  value,
  icon,
  color = "default",
  isLoading = false,
}: StatCardProps) => {
  const { bg, fg } = colorStyles[color];

  if (isLoading) {
    return (
      <Card>
        <Card.Content className="flex flex-col gap-3 p-5">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-16 h-8 rounded-md" />
            <Skeleton className="w-24 h-4 rounded-md" />
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Content className="flex flex-col gap-3 p-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: bg, color: fg }}
        >
          {icon}
        </div>
        <div>
          <Typography variant="h3">{value}</Typography>
          <Typography variant="body-sm" className="text-[--muted] mt-0.5">
            {title}
          </Typography>
        </div>
      </Card.Content>
    </Card>
  );
};
