"use client";

import { Card, Button, Skeleton } from "@heroui/react";
import { Typography } from "@/components/atoms/Typography";
import { EmptyState } from "@/components/atoms/EmptyState";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { UserIcon } from "@/components/atoms/icons/user.icon";
import { useDoctors } from "@/services/queries/useDoctors";
import type { Doctor } from "@/types";

interface DoctorCardGridProps {
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorCardGrid = ({ onBookAppointment }: DoctorCardGridProps) => {
  const { data: doctors, isLoading, isError, refetch, error } = useDoctors();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <DoctorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : "Failed to load doctors."}
        onRetry={refetch}
      />
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <EmptyState
        title="No doctors available"
        description="There are no doctors registered in the system yet."
        icon={<UserIcon className="w-12 h-12" strokeWidth={1} />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} onBook={onBookAppointment} />
      ))}
    </div>
  );
};

const DoctorCard = ({ doctor, onBook }: { doctor: Doctor; onBook: (d: Doctor) => void }) => (
  <Card>
    <Card.Content className="flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "color-mix(in oklab, var(--accent) 12%, transparent)",
            color: "var(--accent)",
          }}
        >
          <UserIcon className="w-5 h-5" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <Typography variant="h4" className="truncate">
            {doctor.name}
          </Typography>
          <Typography variant="body-sm" className="text-[--muted] mt-0.5">
            {doctor.specialty}
          </Typography>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button size="sm" variant="outline" onPress={() => onBook(doctor)}>
          Book Appointment
        </Button>
      </div>
    </Card.Content>
  </Card>
);

const DoctorCardSkeleton = () => (
  <Card>
    <Card.Content className="flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-32 h-5 rounded-md" />
          <Skeleton className="w-24 h-4 rounded-md" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-32 h-8 rounded-lg" />
      </div>
    </Card.Content>
  </Card>
);
