import apiClient from "./axios";
import type { Appointment, AppointmentsApiResponse, CreateAppointmentPayload } from "@/types";

export interface AppointmentsPaginationParams {
  page?: number;
  pageSize?: number;
}

export const appointmentsApi = {
  getByDoctor: async (
    doctorId: string,
    params: AppointmentsPaginationParams = {}
  ): Promise<Appointment[]> => {
    const { data } = await apiClient.get<AppointmentsApiResponse>("/appointments", {
      params: { doctorId, ...params },
    });
    return data.appointments;
  },

  create: async (payload: CreateAppointmentPayload): Promise<Appointment> => {
    const { data } = await apiClient.post<Appointment>("/appointments", payload);
    return data;
  },

  cancel: async (id: string): Promise<{ id: string; status: string }> => {
    const { data } = await apiClient.patch<{ id: string; status: string }>(
      `/appointments/${id}/cancel`
    );
    return data;
  },
};
