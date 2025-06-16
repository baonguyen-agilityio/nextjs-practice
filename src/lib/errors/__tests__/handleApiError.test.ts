import { handleApiError } from "../handleApiError";

describe("handleApiError", () => {
  it("should handle validation errors with field details", () => {
    const validationError = {
      error: {
        name: "ValidationError",
        details: {
          errors: [
            {
              path: ["title"],
              message: "Title is required",
            },
            {
              path: ["price"],
              message: "Price must be a number",
            },
            {
              path: ["title"],
              message: "Title must be at least 3 characters",
            },
          ],
        },
      },
    };

    const result = handleApiError(validationError);

    expect(result).toEqual({
      error: {
        title: ["Title is required", "Title must be at least 3 characters"],
        price: ["Price must be a number"],
      },
    });
  });

  it("should handle validation errors from string input", () => {
    const validationErrorString = JSON.stringify({
      error: {
        name: "ValidationError",
        details: {
          errors: [
            {
              path: ["email"],
              message: "Email is invalid",
            },
          ],
        },
      },
    });

    const result = handleApiError(validationErrorString);

    expect(result).toEqual({
      error: {
        email: ["Email is invalid"],
      },
    });
  });

  it("should handle 403 Forbidden error", () => {
    const forbiddenError = {
      error: {
        status: 403,
      },
    };

    const result = handleApiError(forbiddenError);

    expect(result).toEqual({
      error: "You do not have permission.",
    });
  });

  it("should handle 401 Unauthorized error", () => {
    const unauthorizedError = {
      error: {
        status: 401,
      },
    };

    const result = handleApiError(unauthorizedError);

    expect(result).toEqual({
      error: "Unauthorized access.",
    });
  });

  it("should handle 500 Internal Server Error", () => {
    const serverError = {
      error: {
        status: 500,
      },
    };

    const result = handleApiError(serverError);

    expect(result).toEqual({
      error: "Internal server error.",
    });
  });

  it("should handle custom error message", () => {
    const customError = {
      error: {
        message: "Custom error message",
      },
    };

    const result = handleApiError(customError);

    expect(result).toEqual({
      error: "Custom error message",
    });
  });

  it("should handle malformed JSON string", () => {
    const malformedJSON = "{ invalid json";

    const result = handleApiError(malformedJSON);

    expect(result).toEqual({
      error: "Failed to parse error response.",
    });
  });

  it("should handle unexpected error format", () => {
    const unexpectedError = {
      someProperty: "some value",
    };

    const result = handleApiError(unexpectedError);

    expect(result).toEqual({
      error: "An unexpected error occurred",
    });
  });

  it("should handle null input", () => {
    const result = handleApiError(null);

    expect(result).toEqual({
      error: "An unexpected error occurred",
    });
  });

  it("should handle undefined input", () => {
    const result = handleApiError(undefined);

    expect(result).toEqual({
      error: "An unexpected error occurred",
    });
  });

  it("should handle validation errors with empty path", () => {
    const validationError = {
      error: {
        name: "ValidationError",
        details: {
          errors: [
            {
              path: [],
              message: "General validation error",
            },
            {
              path: ["field1"],
              message: "Field1 error",
            },
          ],
        },
      },
    };

    const result = handleApiError(validationError);

    expect(result).toEqual({
      error: {
        field1: ["Field1 error"],
      },
    });
  });

  it("should handle validation errors with missing path", () => {
    const validationError = {
      error: {
        name: "ValidationError",
        details: {
          errors: [
            {
              message: "Error without path",
            },
            {
              path: ["field1"],
              message: "Field1 error",
            },
          ],
        },
      },
    };

    const result = handleApiError(validationError);

    expect(result).toEqual({
      error: {
        field1: ["Field1 error"],
      },
    });
  });

  it("should handle string error input", () => {
    const stringError = "Simple error message";

    const result = handleApiError(stringError);

    expect(result).toEqual({
      error: "Failed to parse error response.",
    });
  });

  it("should handle Error object input", () => {
    const errorObject = new Error("Standard error message");

    const result = handleApiError(errorObject);

    expect(result).toEqual({
      error: "An unexpected error occurred",
    });
  });
});
