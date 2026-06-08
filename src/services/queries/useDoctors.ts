import { useQuery } from "@tanstack/react-query";
import { doctorsApi } from "@/services/api/doctors.api";
import { queryKeys, STALE_TIME } from "@/constants";

export const useDoctors = () =>
  useQuery({
    queryKey: queryKeys.doctors.list(),
    queryFn: doctorsApi.getAll,
    staleTime: STALE_TIME,
  });
