/** Extracts a human-readable message from a backend RFC 9110 Problem Details error. */
export const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    const withProblem = error as { problem?: { title?: string } };
    if (withProblem.problem?.title) return withProblem.problem.title;

    const axiosError = error as { response?: { data?: { title?: string } } };
    if (axiosError.response?.data?.title) return axiosError.response.data.title;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred. Please try again.";
};
