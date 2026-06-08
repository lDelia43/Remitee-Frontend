import type { PaginationMeta } from "./api.types";

export type AppointmentStatus = "Active" | "Cancelled";

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  scheduledAt: string;
  status: AppointmentStatus;
}

export interface CreateAppointmentPayload {
  doctorId: string;
  patientName: string;
  scheduledAt: string;
}

export interface AppointmentsApiResponse extends PaginationMeta {
  appointments: Appointment[];
}

export interface AppointmentFilters {
  search?: string;
  status?: AppointmentStatus | "all";
}
