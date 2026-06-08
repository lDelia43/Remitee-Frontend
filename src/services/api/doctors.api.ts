import apiClient from "./axios";
import type { Doctor, DoctorsApiResponse } from "@/types";

export const doctorsApi = {
  getAll: async (): Promise<Doctor[]> => {
    const { data } = await apiClient.get<DoctorsApiResponse>("/doctors");
    return data.doctors;
  },
};
