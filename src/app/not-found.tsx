import Link from "next/link";
import { Typography } from "@/components/atoms/Typography";
import { ROUTES } from "@/constants";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center flex flex-col gap-4 max-w-sm">
        <Typography variant="h1" className="text-[--default-foreground] opacity-20">
          404
        </Typography>
        <div>
          <Typography variant="h3">Page not found</Typography>
          <Typography variant="body-sm" className="text-[--muted] mt-1">
            The page you&apos;re looking for doesn&apos;t exist.
          </Typography>
        </div>
        <Link
          href={ROUTES.DASHBOARD}
          className="inline-flex items-center justify-center px-4 py-2 rounded-3xl text-sm font-medium border border-[--border] text-[--foreground] hover:bg-[--default] transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
