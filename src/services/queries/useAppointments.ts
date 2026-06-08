import { useQueries, useQuery } from "@tanstack/react-query";
import { appointmentsApi } from "@/services/api/appointments.api";
import { doctorsApi } from "@/services/api/doctors.api";
import { queryKeys, STALE_TIME } from "@/constants";
import type { Appointment } from "@/types";

const ALL_APPOINTMENTS_PAGE_SIZE = 100;

export const useAllAppointments = () => {
  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: queryKeys.doctors.list(),
    queryFn: doctorsApi.getAll,
    staleTime: STALE_TIME,
  });

  const appointmentQueries = useQueries({
    queries: doctors.map((doctor) => ({
      queryKey: queryKeys.appointments.byDoctor(doctor.id, 1, ALL_APPOINTMENTS_PAGE_SIZE),
      queryFn: () =>
        appointmentsApi.getByDoctor(doctor.id, { page: 1, pageSize: ALL_APPOINTMENTS_PAGE_SIZE }),
      staleTime: STALE_TIME,
    })),
  });

  const isLoading = doctorsLoading || appointmentQueries.some((q) => q.isLoading);
  const isError = appointmentQueries.some((q) => q.isError);
  const error = appointmentQueries.find((q) => q.isError)?.error ?? null;
  const appointments: Appointment[] = appointmentQueries.flatMap((q) => q.data ?? []);

  return { appointments, isLoading, isError, error };
};

export const useAppointmentsByDoctor = (doctorId: string, page?: number, pageSize?: number) =>
  useQuery({
    queryKey: queryKeys.appointments.byDoctor(doctorId, page, pageSize),
    queryFn: () => appointmentsApi.getByDoctor(doctorId, { page, pageSize }),
    enabled: Boolean(doctorId),
    staleTime: STALE_TIME,
  });

export const useAppointmentStats = () => {
  const { appointments, isLoading, isError } = useAllAppointments();

  const stats = {
    total: appointments.length,
    active: appointments.filter((a) => a.status === "Active").length,
    cancelled: appointments.filter((a) => a.status === "Cancelled").length,
  };

  return { data: stats, isLoading, isError };
};
