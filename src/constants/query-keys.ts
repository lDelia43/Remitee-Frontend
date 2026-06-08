export const queryKeys = {
  doctors: {
    all: ["doctors"] as const,
    list: () => [...queryKeys.doctors.all, "list"] as const,
  },
  appointments: {
    all: ["appointments"] as const,
    byDoctorAll: (doctorId: string) =>
      [...queryKeys.appointments.all, "doctor", doctorId] as const,
    byDoctor: (doctorId: string, page?: number, pageSize?: number) =>
      [...queryKeys.appointments.byDoctorAll(doctorId), { page, pageSize }] as const,
  },
} as const;
