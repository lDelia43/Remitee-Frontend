import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCancelAppointment } from "@/services/mutations/useCancelAppointment";
import { appointmentsApi } from "@/services/api/appointments.api";
import { queryKeys } from "@/constants/query-keys";
import { createWrapper } from "@/test/setup";
import type { Appointment } from "@/types";

vi.mock("@/services/api/appointments.api");

const DOCTOR_ID = "doc-1";
const APPT_ID = "appt-1";

const mockAppointments: Appointment[] = [
  { id: APPT_ID, doctorId: DOCTOR_ID, patientName: "Jane Doe", scheduledAt: "2099-01-15T10:00:00Z", status: "Active" },
  { id: "appt-2", doctorId: DOCTOR_ID, patientName: "John Smith", scheduledAt: "2099-01-16T11:00:00Z", status: "Active" },
];

/** Seeds the QueryClient cache with mock appointments for the given doctor. */
const seedCache = (queryClient: ReturnType<typeof createWrapper>["queryClient"]) => {
  queryClient.setQueryData(
    queryKeys.appointments.byDoctor(DOCTOR_ID, 1, 100),
    mockAppointments
  );
};

describe("useCancelAppointment", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("calls appointmentsApi.cancel with the appointment id", async () => {
    vi.mocked(appointmentsApi.cancel).mockResolvedValueOnce({ id: APPT_ID, status: "Cancelled" });
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCancelAppointment(), { wrapper });

    await act(async () => {
      result.current.mutate({ id: APPT_ID, doctorId: DOCTOR_ID });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(appointmentsApi.cancel).toHaveBeenCalledOnce();
    expect(appointmentsApi.cancel).toHaveBeenCalledWith(APPT_ID);
  });

  it("applies an optimistic update to the cache before the API responds", async () => {
    let resolve!: (value: { id: string; status: string }) => void;
    vi.mocked(appointmentsApi.cancel).mockReturnValueOnce(
      new Promise((r) => { resolve = r; })
    );

    const { wrapper, queryClient } = createWrapper();
    seedCache(queryClient);

    const { result } = renderHook(() => useCancelAppointment(), { wrapper });

    act(() => {
      result.current.mutate({ id: APPT_ID, doctorId: DOCTOR_ID });
    });

    // Give onMutate time to run
    await waitFor(() => {
      const cached = queryClient.getQueryData<Appointment[]>(
        queryKeys.appointments.byDoctor(DOCTOR_ID, 1, 100)
      );
      const cancelled = cached?.find((a) => a.id === APPT_ID);
      expect(cancelled?.status).toBe("Cancelled");
    });

    // Unresolved other appointment should be untouched
    const cached = queryClient.getQueryData<Appointment[]>(
      queryKeys.appointments.byDoctor(DOCTOR_ID, 1, 100)
    );
    expect(cached?.find((a) => a.id === "appt-2")?.status).toBe("Active");

    await act(async () => {
      resolve({ id: APPT_ID, status: "Cancelled" });
    });
  });

  it("rolls back the optimistic update when the API rejects", async () => {
    vi.mocked(appointmentsApi.cancel).mockRejectedValueOnce(new Error("Server error"));

    const { wrapper, queryClient } = createWrapper();
    seedCache(queryClient);

    const { result } = renderHook(() => useCancelAppointment(), { wrapper });

    await act(async () => {
      result.current.mutate({ id: APPT_ID, doctorId: DOCTOR_ID });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const cached = queryClient.getQueryData<Appointment[]>(
      queryKeys.appointments.byDoctor(DOCTOR_ID, 1, 100)
    );
    // Cache should be back to original Active status
    expect(cached?.find((a) => a.id === APPT_ID)?.status).toBe("Active");
  });

  it("invalidates byDoctorAll queries on settled (success case)", async () => {
    vi.mocked(appointmentsApi.cancel).mockResolvedValueOnce({ id: APPT_ID, status: "Cancelled" });

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCancelAppointment(), { wrapper });

    await act(async () => {
      result.current.mutate({ id: APPT_ID, doctorId: DOCTOR_ID });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.appointments.byDoctorAll(DOCTOR_ID),
    });
  });

  it("invalidates byDoctorAll queries on settled (error case)", async () => {
    vi.mocked(appointmentsApi.cancel).mockRejectedValueOnce(new Error("Server error"));

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCancelAppointment(), { wrapper });

    await act(async () => {
      result.current.mutate({ id: APPT_ID, doctorId: DOCTOR_ID });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.appointments.byDoctorAll(DOCTOR_ID),
    });
  });
});
