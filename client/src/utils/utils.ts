export const API_URL =
  import.meta.env.VITE_API_URL || "https://not-google-forms.onrender.com/api";

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "https://not-google-forms.onrender.com";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
