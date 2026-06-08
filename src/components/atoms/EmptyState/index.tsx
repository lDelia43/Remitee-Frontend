import { Typography } from "../Typography";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
    {icon && <div style={{ color: "var(--muted)" }} className="mb-2">{icon}</div>}
    <div className="space-y-1">
      <Typography variant="h4" className="text-[--muted]">
        {title}
      </Typography>
      {description && (
        <Typography variant="body-sm" className="text-[--muted] max-w-sm mx-auto opacity-70">
          {description}
        </Typography>
      )}
    </div>
    {action && <div className="mt-2">{action}</div>}
  </div>
);
