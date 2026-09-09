import type { Gender, StudentStatus } from "../types";

export const TOKEN_KEY = "sms_token";

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const STATUS_OPTIONS: { value: StudentStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "graduated", label: "Graduated" },
];

export const PAGE_SIZE = 10;

export const CURRENCY_LOCALE = "en-IN";
export const CURRENCY_CODE = "INR";
