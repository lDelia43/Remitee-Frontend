"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Typography } from "@/components/atoms/Typography";
import { PlusIcon } from "@/components/atoms/icons/plus.icon";
import { AppointmentTable } from "@/components/organisms/AppointmentTable";
import { CancelAppointmentModal } from "@/components/organisms/CancelAppointmentModal";
import { CreateAppointmentModal } from "@/components/organisms/CreateAppointmentModal";
import { PageLayout } from "../PageLayout";
import type { Appointment } from "@/types";

export const AppointmentsTemplate = () => {
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <PageLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Typography variant="h2">Appointments</Typography>
            <Typography variant="body-sm" className="text-default-500 mt-1">
              Manage and track all patient appointments
            </Typography>
          </div>
          <Button
            variant="primary"
            size="sm"
            onPress={() => setIsCreateModalOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            New Appointment
          </Button>
        </div>

        <AppointmentTable onCancelAppointment={setAppointmentToCancel} />
      </div>

      <CancelAppointmentModal
        appointment={appointmentToCancel}
        isOpen={Boolean(appointmentToCancel)}
        onClose={() => setAppointmentToCancel(null)}
      />

      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </PageLayout>
  );
};
