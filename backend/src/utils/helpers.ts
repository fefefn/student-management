/** Escapes user input so it can be safely used inside a RegExp (for search). */
export const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const capitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[0-9][0-9\s-]{6,14}$/;
export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
