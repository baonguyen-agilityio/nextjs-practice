import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import LoginForm from "../LoginForm";
import { addToast } from "@heroui/react";
import { authenticate } from "@/app/actions";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

const mockUseActionState = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (...args: any[]) => mockUseActionState(...args),
  useState: jest.fn().mockImplementation((initial) => [initial, jest.fn()]),
}));

jest.mock("@heroui/react", () => ({
  addToast: jest.fn(),
}));

jest.mock("@/app/actions", () => ({
  authenticate: jest.fn(),
}));

jest.mock("@/components/ui/Input", () => ({
  Input: ({ label, value, onChange, type, required, isDisabled, ...props }: any) => (
    <div>
      <label htmlFor={props.id}>{label}</label>
      <input
        id={props.id}
        name={props.name}
        type={type}
        required={required}
        disabled={isDisabled}
        value={value}
        onChange={onChange}
        {...props}
      />
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

describe("LoginForm", () => {
  const mockSearchParams = {
    get: jest.fn(),
  };
  const mockFormAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue(mockSearchParams as any);
    mockSearchParams.get.mockReturnValue(null);
    mockUseActionState.mockReturnValue([undefined, mockFormAction, false]);
  });

  it("should render form with email, password inputs and submit button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("should have correct input types and required attributes", () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("required");
  });

  it("should use callback URL from search params", () => {
    mockSearchParams.get.mockReturnValue("/dashboard");
    render(<LoginForm />);

    expect(screen.getByDisplayValue("/dashboard")).toHaveAttribute("name", "redirectTo");
  });

  it("should use default callback URL when none provided", () => {
    render(<LoginForm />);

    expect(screen.getByDisplayValue("/")).toHaveAttribute("name", "redirectTo");
  });

  it("should have proper form field names", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("name", "password");
  });

  it("should show loading state when form is pending", () => {
    mockUseActionState.mockReturnValue([undefined, mockFormAction, true]);
    render(<LoginForm />);

    expect(screen.getByText("Signing in...")).toBeInTheDocument();
  });

  it("should disable inputs when form is pending", () => {
    mockUseActionState.mockReturnValue([undefined, mockFormAction, true]);
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password")).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should handle input changes", () => {
    const mockSetEmail = jest.fn();
    const mockSetPassword = jest.fn();

    require("react")
      .useState.mockReturnValueOnce(["", mockSetEmail])
      .mockReturnValueOnce(["", mockSetPassword]);

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });

    expect(mockSetEmail).toHaveBeenCalledWith("test@example.com");
    expect(mockSetPassword).toHaveBeenCalledWith("password123");
  });

  it("should show toast on authentication failure", async () => {
    const mockFormActionInternal = jest.fn();
    mockUseActionState.mockImplementation((fn) => [undefined, mockFormActionInternal, false]);
    mockAuthenticate.mockResolvedValue("Invalid identifier or password");

    render(<LoginForm />);

    const formData = new FormData();
    const formAction = mockUseActionState.mock.calls[0][0];
    await formAction(undefined, formData);

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
    const formAction = mockUseActionState.mock.calls[0][0];
    await formAction(undefined, formData);

    expect(mockAddToast).not.toHaveBeenCalled();
  });

  it("should render wrapper with correct classes", () => {
    const { container } = render(<LoginForm />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("w-full", "max-w-md", "mx-auto", "space-y-8");
  });

  it("should render form with correct classes", () => {
    render(<LoginForm />);

    const form = screen.getByRole("button").closest("form");
    expect(form).toHaveClass("space-y-6");
  });

  it("should have form action set correctly", () => {
    render(<LoginForm />);

    const form = screen.getByRole("button").closest("form");
    expect(form).toHaveAttribute("action");
  });

  it("should render hidden input with correct attributes", () => {
    render(<LoginForm />);

    const hiddenInput = screen.getByDisplayValue("/");
    expect(hiddenInput).toHaveAttribute("type", "hidden");
    expect(hiddenInput).toHaveAttribute("name", "redirectTo");
  });

  it("should render button with fullWidth prop", () => {
    render(<LoginForm />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-fullwidth", "true");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("should show toast for different error message", async () => {
    mockAuthenticate.mockResolvedValue("Something went wrong.");

    render(<LoginForm />);

    const formData = new FormData();
    const formAction = mockUseActionState.mock.calls[0][0];
    await formAction(undefined, formData);

    expect(mockAddToast).toHaveBeenCalledWith({
      title: "Login failed",
      description: "Something went wrong.",
      color: "danger",
    });
  });

  it("should return result from formAction", async () => {
    mockAuthenticate.mockResolvedValue("Invalid identifier or password");

    render(<LoginForm />);

    const formData = new FormData();
    const formAction = mockUseActionState.mock.calls[0][0];
    const result = await formAction(undefined, formData);

    expect(result).toBe("Invalid identifier or password");
  });

  it("should return undefined result from formAction on success", async () => {
    mockAuthenticate.mockResolvedValue(undefined);

    render(<LoginForm />);

    const formData = new FormData();
    const formAction = mockUseActionState.mock.calls[0][0];
    const result = await formAction(undefined, formData);

    expect(result).toBeUndefined();
  });

  it("should handle callbackUrl search param correctly", () => {
    mockSearchParams.get.mockReturnValue("/admin/users");
    render(<LoginForm />);

    expect(screen.getByDisplayValue("/admin/users")).toHaveAttribute("name", "redirectTo");
  });

  it("should call authenticate with correct parameters", async () => {
    render(<LoginForm />);

    const formData = new FormData();
    const prevState = "previous error";
    const formAction = mockUseActionState.mock.calls[0][0];
    await formAction(prevState, formData);

    expect(mockAuthenticate).toHaveBeenCalledWith(prevState, formData);
  });
});
