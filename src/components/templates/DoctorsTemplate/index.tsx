"use client";

import { useState } from "react";
import { Typography } from "@/components/atoms/Typography";
import { DoctorCardGrid } from "@/components/organisms/DoctorCardGrid";
import { CreateAppointmentModal } from "@/components/organisms/CreateAppointmentModal";
import { PageLayout } from "../PageLayout";
import type { Doctor } from "@/types";

export const DoctorsTemplate = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(undefined);
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Typography variant="h2">Doctors</Typography>
            <Typography variant="body-sm" className="text-default-500 mt-1">
              Browse available doctors and schedule appointments
            </Typography>
          </div>
        </div>

        <DoctorCardGrid onBookAppointment={handleBookAppointment} />
      </div>

      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        preselectedDoctor={selectedDoctor}
      />
    </PageLayout>
  );
};
