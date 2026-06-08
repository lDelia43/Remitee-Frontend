import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "@/services/api/appointments.api";
import { queryKeys } from "@/constants";
import type { CreateAppointmentPayload } from "@/types";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) => appointmentsApi.create(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.byDoctorAll(variables.doctorId),
      });
    },
  });
};
