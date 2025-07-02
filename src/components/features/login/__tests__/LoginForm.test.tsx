import { render, screen, fireEvent } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import LoginForm from "../LoginForm";
import { addToast } from "@heroui/react";
import { authenticate } from "@/app/actions";

const mockUseActionState = jest.fn().mockImplementation((callback) => {
  return [
    undefined,
    async (prevState: string | undefined, formData: FormData) => {
      const result = await callback(prevState, formData);
      return result;
    },
    false,
  ];
});

jest.mock("react", () => {
  const actualReact = jest.requireActual("react");
  return {
    ...actualReact,
    useActionState: (...args: any[]) => mockUseActionState(...args),
  };
});

jest.mock("@/app/actions", () => ({
  authenticate: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/hooks/useFormValidation", () => ({
  useFormValidation: jest.fn().mockReturnValue({
    formData: {},
    handleFieldChange: jest.fn(),
    combineErrors: jest.fn().mockReturnValue({}),
    validationErrors: {},
    combinedErrors: {},
  }),
}));

jest.mock("@heroui/react", () => ({
  addToast: jest.fn(),
}));

jest.mock("@/components/ui/ValidatedFormField", () => ({
  ValidatedFormField: ({ field, value, onChange, errorMessage, isDisabled, size }: any) => (
    <div>
      <label htmlFor={field.name}>{field.label}</label>
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        required={field.required}
        disabled={isDisabled}
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
      {errorMessage && <div data-testid="error-message">{errorMessage}</div>}
    </div>
  ),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: ({ children, isLoading, isDisabled, type, fullWidth, ...props }: any) => (
    <button type={type} disabled={isDisabled} data-fullwidth={fullWidth} {...props}>
      {children}
    </button>
  ),
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockAddToast = addToast as jest.MockedFunction<typeof addToast>;
const mockAuthenticate = authenticate as jest.MockedFunction<typeof authenticate>;
const mockUseFormValidation = require("@/hooks/useFormValidation")
  .useFormValidation as jest.MockedFunction<any>;

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockSearchParams = {
      get: jest.fn(),
      append: jest.fn(),
      delete: jest.fn(),
      set: jest.fn(),
      sort: jest.fn(),
    };

    mockUseSearchParams.mockReturnValue(mockSearchParams as any);
  });

  it("should render form with email, password inputs and submit button", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("should handle input changes", () => {
    const { handleFieldChange } = require("@/hooks/useFormValidation").useFormValidation();
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    expect(handleFieldChange).toHaveBeenCalledWith("email", "test@example.com");
    expect(handleFieldChange).toHaveBeenCalledWith("password", "password123");
  });

  it("should show toast on authentication failure", async () => {
    mockAuthenticate.mockResolvedValue("Invalid identifier or password");
    render(<LoginForm />);
    const formData = new FormData();
    await mockUseActionState.mock.calls[0][0](undefined, formData);
    expect(mockAddToast).toHaveBeenCalledWith({
      title: "Login failed",
      description: "Invalid identifier or password",
      color: "danger",
    });
  });

  it("should not show toast on successful authentication", async () => {
    mockAuthenticate.mockResolvedValue(undefined);
    render(<LoginForm />);
    const formData = new FormData();
    await mockUseActionState.mock.calls[0][0](undefined, formData);
    expect(mockAddToast).not.toHaveBeenCalled();
  });
});
