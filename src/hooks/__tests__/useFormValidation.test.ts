import { renderHook, act } from "@testing-library/react";
import { z } from "zod";
import { useFormValidation } from "../useFormValidation";

describe("useFormValidation", () => {
  const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    age: z.string().min(1, "Age is required"),
  });

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "age", label: "Age", type: "number", required: false },
  ];

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    expect(result.current.formData).toEqual({
      name: "",
      email: "",
      age: "",
    });
    expect(result.current.validationErrors).toEqual({});
  });

  it("should initialize with provided initial values", () => {
    const initialValues = { name: "John", email: "john@example.com" };
    const { result } = renderHook(() => useFormValidation({ schema, fields, initialValues }));

    expect(result.current.formData).toEqual({
      name: "John",
      email: "john@example.com",
      age: "",
    });
  });

  it("should handle field changes", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    act(() => {
      result.current.handleFieldChange("name", "John");
    });

    expect(result.current.formData.name).toBe("John");
  });

  it("should validate field with valid input", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    act(() => {
      result.current.handleFieldChange("name", "John");
    });

    expect(result.current.validationErrors).toEqual({});
  });

  it("should validate field with invalid input", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    act(() => {
      result.current.handleFieldChange("name", "J");
    });

    expect(result.current.validationErrors.name).toBe("Name must be at least 2 characters");
  });

  it("should validate email field", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    act(() => {
      result.current.handleFieldChange("email", "invalid-email");
    });

    expect(result.current.validationErrors.email).toBe("Invalid email format");

    act(() => {
      result.current.handleFieldChange("email", "valid@example.com");
    });

    expect(result.current.validationErrors.email).toBeUndefined();
  });

  it("should clear validation error when field becomes valid", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    act(() => {
      result.current.handleFieldChange("name", "J");
    });

    expect(result.current.validationErrors.name).toBe("Name must be at least 2 characters");

    act(() => {
      result.current.handleFieldChange("name", "John");
    });

    expect(result.current.validationErrors.name).toBeUndefined();
  });

  it("should reset form", () => {
    const initialValues = { name: "John", email: "john@example.com" };
    const { result } = renderHook(() => useFormValidation({ schema, fields, initialValues }));

    act(() => {
      result.current.handleFieldChange("name", "Jane");
      result.current.handleFieldChange("email", "invalid");
    });

    expect(result.current.formData.name).toBe("Jane");
    expect(result.current.validationErrors.email).toBeTruthy();

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({
      name: "John",
      email: "john@example.com",
      age: "",
    });
    expect(result.current.validationErrors).toEqual({});
  });

  it("should combine errors with server errors", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    act(() => {
      result.current.handleFieldChange("name", "J");
    });

    const serverErrors = { email: "Email already exists", age: "Invalid age" };
    const combinedErrors = result.current.combineErrors(serverErrors);

    expect(combinedErrors).toEqual({
      name: "Name must be at least 2 characters",
      email: "Email already exists",
      age: "Invalid age",
    });
  });

  it("should handle server errors as arrays", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    const serverErrors = {
      email: ["Email already exists", "Invalid format"],
      age: [],
    };
    const combinedErrors = result.current.combineErrors(serverErrors);

    expect(combinedErrors.email).toBe("Email already exists");
    expect(combinedErrors.age).toBe("");
  });

  it("should validate individual field", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    act(() => {
      result.current.validateField("name", "J");
    });

    expect(result.current.validationErrors.name).toBe("Name must be at least 2 characters");

    act(() => {
      result.current.validateField("name", "John");
    });

    expect(result.current.validationErrors.name).toBeUndefined();
  });

  it("should handle empty values for non-required fields", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    act(() => {
      result.current.handleFieldChange("age", "");
    });

    expect(result.current.validationErrors.age).toBeUndefined();
  });

  it("should set form data directly", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    const newData = { name: "Jane", email: "jane@example.com", age: "25" };

    act(() => {
      result.current.setFormData(newData);
    });

    expect(result.current.formData).toEqual(newData);
  });

  it("should set validation errors directly", () => {
    const { result } = renderHook(() => useFormValidation({ schema, fields }));

    const newErrors = { name: "Custom error", email: "Another error" };

    act(() => {
      result.current.setValidationErrors(newErrors);
    });

    expect(result.current.validationErrors).toEqual(newErrors);
  });
});
