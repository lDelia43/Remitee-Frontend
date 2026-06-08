import { describe, it, expect } from "vitest";
import { extractErrorMessage } from "@/utils/error.utils";

const FALLBACK = "An unexpected error occurred. Please try again.";

describe("extractErrorMessage", () => {
  it("returns problem.title from a RFC 9110 enriched Axios error", () => {
    const error = { problem: { title: "Appointment not found" } };
    expect(extractErrorMessage(error)).toBe("Appointment not found");
  });

  it("prefers problem.title over response.data.title", () => {
    const error = {
      problem: { title: "From interceptor" },
      response: { data: { title: "From response" } },
    };
    expect(extractErrorMessage(error)).toBe("From interceptor");
  });

  it("falls back to response.data.title when problem is absent", () => {
    const error = { response: { data: { title: "Conflict — slot already taken" } } };
    expect(extractErrorMessage(error)).toBe("Conflict — slot already taken");
  });

  it("returns the message from a native Error instance", () => {
    expect(extractErrorMessage(new Error("Network error"))).toBe("Network error");
  });

  it("returns the fallback string for null", () => {
    expect(extractErrorMessage(null)).toBe(FALLBACK);
  });

  it("returns the fallback string for undefined", () => {
    expect(extractErrorMessage(undefined)).toBe(FALLBACK);
  });

  it("returns the fallback string for an empty object", () => {
    expect(extractErrorMessage({})).toBe(FALLBACK);
  });

  it("returns the fallback string for a plain string that is not an Error", () => {
    // Raw strings are not Error instances and don't have .problem
    expect(extractErrorMessage("some string")).toBe(FALLBACK);
  });
});
