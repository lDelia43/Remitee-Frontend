"use client";

import { useDoctors } from "@/services/queries/useDoctors";
import { useAppointmentStats } from "@/services/queries/useAppointments";
import { StatCard } from "@/components/molecules/StatCard";
import { IdentificationIcon } from "@/components/atoms/icons/identification.icon";
import { CalendarIcon } from "@/components/atoms/icons/calendar.icon";
import { CheckIcon } from "@/components/atoms/icons/check.icon";
import { XMarkIcon } from "@/components/atoms/icons/xMark.icon";

export const DashboardStats = () => {
  const { data: doctors, isLoading: doctorsLoading } = useDoctors();
  const { data: stats, isLoading: statsLoading } = useAppointmentStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Doctors"
        value={doctors?.length ?? 0}
        icon={<IdentificationIcon className="w-5 h-5" strokeWidth={1.8} />}
        color="primary"
        isLoading={doctorsLoading}
      />
      <StatCard
        title="Total Appointments"
        value={stats?.total ?? 0}
        icon={<CalendarIcon className="w-5 h-5" strokeWidth={1.8} />}
        color="default"
        isLoading={statsLoading}
      />
      <StatCard
        title="Active Appointments"
        value={stats?.active ?? 0}
        icon={<CheckIcon className="w-5 h-5" strokeWidth={1.8} />}
        color="success"
        isLoading={statsLoading}
      />
      <StatCard
        title="Cancelled"
        value={stats?.cancelled ?? 0}
        icon={<XMarkIcon className="w-5 h-5" strokeWidth={1.8} />}
        color="danger"
        isLoading={statsLoading}
      />
    </div>
  );
};
