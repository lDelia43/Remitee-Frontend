import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "@/services/api/appointments.api";
import { queryKeys } from "@/constants";
import type { Appointment } from "@/types";

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; doctorId: string }) => appointmentsApi.cancel(id),
    onMutate: async ({ id, doctorId }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.appointments.byDoctorAll(doctorId),
      });

      const previousEntries = queryClient.getQueriesData<Appointment[]>({
        queryKey: queryKeys.appointments.byDoctorAll(doctorId),
      });

      queryClient.setQueriesData<Appointment[]>(
        { queryKey: queryKeys.appointments.byDoctorAll(doctorId) },
        (old) => old?.map((a) => (a.id === id ? { ...a, status: "Cancelled" as const } : a))
      );

      return { previousEntries, doctorId };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousEntries) {
        for (const [queryKey, data] of context.previousEntries) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.byDoctorAll(variables.doctorId),
      });
    },
  });
};
