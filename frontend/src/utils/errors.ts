import axios from "axios";
import type { ApiErrorResponse } from "../types";

/** Extracts a human-readable message from any error thrown by the API layer. */
export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.code === "ECONNABORTED") return "The request timed out. Please try again.";
    if (!error.response) return "Cannot reach the server. Make sure the backend is running.";
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

/** Maps API validation errors ({ field, message }[]) to { [field]: message } for forms. */
export const getFieldErrors = (error: unknown): Record<string, string> => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) return {};
  const fieldErrors = error.response?.data?.errors ?? [];
  return fieldErrors.reduce<Record<string, string>>((acc, item) => {
    if (!acc[item.field]) acc[item.field] = item.message;
    return acc;
  }, {});
};
