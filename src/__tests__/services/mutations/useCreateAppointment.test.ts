import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCreateAppointment } from "@/services/mutations/useCreateAppointment";
import { appointmentsApi } from "@/services/api/appointments.api";
import { queryKeys } from "@/constants/query-keys";
import { createWrapper } from "@/test/setup";
import type { Appointment } from "@/types";

vi.mock("@/services/api/appointments.api");

const mockAppointment: Appointment = {
  id: "appt-1",
  doctorId: "doc-1",
  patientName: "Jane Doe",
  scheduledAt: "2099-01-15T10:00:00.000Z",
  status: "Active",
};

const payload = {
  doctorId: "doc-1",
  patientName: "Jane Doe",
  scheduledAt: "2099-01-15T10:00:00.000Z",
};

describe("useCreateAppointment", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("calls appointmentsApi.create with the correct payload", async () => {
    vi.mocked(appointmentsApi.create).mockResolvedValueOnce(mockAppointment);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateAppointment(), { wrapper });

    await act(async () => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(appointmentsApi.create).toHaveBeenCalledOnce();
    expect(appointmentsApi.create).toHaveBeenCalledWith(payload);
  });

  it("invalidates byDoctorAll cache on success", async () => {
    vi.mocked(appointmentsApi.create).mockResolvedValueOnce(mockAppointment);
    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateAppointment(), { wrapper });

    await act(async () => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.appointments.byDoctorAll(payload.doctorId),
    });
  });

  it("exposes isPending=true while the mutation is in flight", async () => {
    let resolve!: (value: Appointment) => void;
    vi.mocked(appointmentsApi.create).mockReturnValueOnce(
      new Promise((r) => {
        resolve = r;
      })
    );
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateAppointment(), { wrapper });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    await act(async () => {
      resolve(mockAppointment);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
  });

  it("sets isError=true when the API rejects", async () => {
    vi.mocked(appointmentsApi.create).mockRejectedValueOnce(new Error("Slot already taken"));
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateAppointment(), { wrapper });

    await act(async () => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
