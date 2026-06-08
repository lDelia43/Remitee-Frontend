import { Typography } from "@/components/atoms/Typography";
import { DashboardStats } from "@/components/organisms/DashboardStats";
import { PageLayout } from "../PageLayout";

export const DashboardTemplate = () => (
  <PageLayout>
    <div className="flex flex-col gap-8">
      <div>
        <Typography variant="h2">Dashboard</Typography>
        <Typography variant="body-sm" className="text-default-500 mt-1">
          Overview of your medical appointment system
        </Typography>
      </div>
      <DashboardStats />
    </div>
  </PageLayout>
);
