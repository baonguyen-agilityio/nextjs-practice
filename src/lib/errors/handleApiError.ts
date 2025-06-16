type FieldErrors = Record<string, string[]>;

interface ParsedError {
  error: string | FieldErrors;
}

export function handleApiError(errorRaw: unknown): ParsedError {
  let message = "An unexpected error occurred";

  try {
    const parsed = typeof errorRaw === "string" ? JSON.parse(errorRaw) : errorRaw;
    const errorObj = parsed?.error;

    if (errorObj?.name === "ValidationError" && Array.isArray(errorObj?.details?.errors)) {
      const fieldErrors: FieldErrors = {};

      for (const err of errorObj.details.errors) {
        const key = err.path?.[0];
        if (key) {
          if (!fieldErrors[key]) fieldErrors[key] = [];
          fieldErrors[key].push(err.message);
        }
      }

      return { error: fieldErrors };
    }

    if (errorObj?.status === 403) message = "You do not have permission.";
    else if (errorObj?.status === 401) message = "Unauthorized access.";
    else if (errorObj?.status === 500) message = "Internal server error.";
    else if (typeof errorObj?.message === "string") message = errorObj.message;
  } catch {
    message = "Failed to parse error response.";
  }

  return { error: message };
}
