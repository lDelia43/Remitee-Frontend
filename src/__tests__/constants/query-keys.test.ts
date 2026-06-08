import { describe, it, expect } from "vitest";
import { queryKeys } from "@/constants/query-keys";

describe("queryKeys.doctors", () => {
  it("list() starts with the doctors prefix", () => {
    expect(queryKeys.doctors.list()[0]).toBe("doctors");
  });

  it("list() is distinct from the bare all key", () => {
    expect(queryKeys.doctors.list()).not.toEqual(queryKeys.doctors.all);
  });
});

describe("queryKeys.appointments", () => {
  it("byDoctorAll includes 'appointments' and the doctorId", () => {
    const key = queryKeys.appointments.byDoctorAll("doc-1");
    expect(key).toContain("appointments");
    expect(key).toContain("doc-1");
  });

  it("byDoctor is a superset of byDoctorAll (prefix invalidation works)", () => {
    const prefix = queryKeys.appointments.byDoctorAll("doc-1");
    const full = queryKeys.appointments.byDoctor("doc-1", 1, 100);
    // Every element in prefix must appear at the same index in full
    prefix.forEach((segment, i) => {
      expect(full[i]).toEqual(segment);
    });
    expect(full.length).toBeGreaterThan(prefix.length);
  });

  it("two different doctorIds produce different byDoctorAll keys", () => {
    expect(queryKeys.appointments.byDoctorAll("doc-1")).not.toEqual(
      queryKeys.appointments.byDoctorAll("doc-2")
    );
  });

  it("byDoctor with different pagination params produces different keys", () => {
    const page1 = queryKeys.appointments.byDoctor("doc-1", 1, 10);
    const page2 = queryKeys.appointments.byDoctor("doc-1", 2, 10);
    expect(page1).not.toEqual(page2);
  });
});
