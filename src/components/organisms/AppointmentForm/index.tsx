"use client";

import { useState } from "react";
import { Button, toast } from "@heroui/react";
import { FormField } from "@/components/molecules/FormField";
import { Typography } from "@/components/atoms/Typography";
import { SpinnerIcon } from "@/components/atoms/icons/spinner.icon";
import { useCreateAppointment } from "@/services/mutations/useCreateAppointment";
import { useDoctors } from "@/services/queries/useDoctors";
import {
  getNowLocalDatetimeString,
  localDatetimeToUtcIso,
  isDatetimeInPast,
  extractErrorMessage,
} from "@/utils";
import type { Doctor } from "@/types";

interface AppointmentFormProps {
  preselectedDoctor?: Doctor;
  onSuccess: (patientName: string) => void;
  onCancel: () => void;
}

interface FormState {
  doctorId: string;
  patientName: string;
  scheduledAt: string;
}

const emptyForm: FormState = { doctorId: "", patientName: "", scheduledAt: "" };

export const AppointmentForm = ({
  preselectedDoctor,
  onSuccess,
  onCancel,
}: AppointmentFormProps) => {
  const { data: doctors } = useDoctors();
  const { mutate: createAppointment, isPending } = useCreateAppointment();
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    doctorId: preselectedDoctor?.id ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.doctorId) errors.doctorId = "Please select a doctor.";
    if (!form.patientName.trim()) errors.patientName = "Patient name is required.";
    if (!form.scheduledAt) {
      errors.scheduledAt = "Date and time are required.";
    } else if (isDatetimeInPast(form.scheduledAt)) {
      errors.scheduledAt = "Cannot schedule an appointment in the past.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createAppointment(
      {
        doctorId: form.doctorId,
        patientName: form.patientName.trim(),
        scheduledAt: localDatetimeToUtcIso(form.scheduledAt),
      },
      {
        onSuccess: () => {
          toast.success("Appointment created", {
            description: "The appointment has been scheduled successfully.",
          });
          onSuccess(form.patientName.trim());
        },
        onError: (err) => {
          toast.danger("Failed to create appointment", {
            description: extractErrorMessage(err),
          });
        },
      }
    );
  };

  const doctorOptions =
    doctors?.map((d) => ({ value: d.id, label: `${d.name} — ${d.specialty}` })) ?? [];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Typography variant="body-sm" className="text-[--muted]">
        Fill in the details below to schedule a new appointment.
      </Typography>

      <FormField
        type="select"
        label="Doctor"
        value={form.doctorId}
        onChange={(v) => setField("doctorId", v)}
        options={doctorOptions}
        isRequired
        error={fieldErrors.doctorId}
      />

      <FormField
        type="text"
        label="Patient Name"
        value={form.patientName}
        onChange={(v) => setField("patientName", v)}
        placeholder="Enter patient full name"
        isRequired
        error={fieldErrors.patientName}
      />

      <FormField
        type="datetime-local"
        label="Date & Time"
        value={form.scheduledAt}
        onChange={(v) => setField("scheduledAt", v)}
        min={getNowLocalDatetimeString()}
        isRequired
        error={fieldErrors.scheduledAt}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onPress={onCancel} isDisabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isDisabled={isPending}>
          {isPending ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : null}
          {isPending ? "Scheduling..." : "Schedule Appointment"}
        </Button>
      </div>
    </form>
  );
};
