import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import LoginForm from "../LoginForm";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn().mockReturnValue([undefined, jest.fn(), false]),
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
    <button type={type} disabled={isDisabled} {...props}>
      {isLoading ? "Loading..." : children}
    </button>
  ),
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

describe("LoginForm", () => {
  const mockSearchParams = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue(mockSearchParams as any);
    mockSearchParams.get.mockReturnValue(null);
  });

  it("should render all form fields", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("should have required attributes on form fields", () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("required");
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should include callback URL from search params", () => {
    mockSearchParams.get.mockReturnValue("/dashboard");
    render(<LoginForm />);

    const hiddenInput = screen.getByDisplayValue("/dashboard");
    expect(hiddenInput).toHaveAttribute("name", "redirectTo");
    expect(hiddenInput).toHaveAttribute("type", "hidden");
  });

  it("should use default callback URL when none provided", () => {
    mockSearchParams.get.mockReturnValue(null);
    render(<LoginForm />);

    const hiddenInput = screen.getByDisplayValue("/");
    expect(hiddenInput).toHaveAttribute("name", "redirectTo");
  });

  it("should have proper form structure", () => {
    render(<LoginForm />);

    const form = screen.getByRole("button", { name: /sign in/i }).closest("form");
    expect(form).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    expect(emailInput).toHaveAttribute("id", "email");
    expect(emailInput).toHaveAttribute("name", "email");
    expect(passwordInput).toHaveAttribute("id", "password");
    expect(passwordInput).toHaveAttribute("name", "password");
  });

  it("should render form with proper accessibility attributes", () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("should handle search params correctly for callback URL", () => {
    mockSearchParams.get.mockReturnValue("/admin/dashboard");
    render(<LoginForm />);

    const hiddenInput = screen.getByDisplayValue("/admin/dashboard");
    expect(hiddenInput).toHaveAttribute("name", "redirectTo");
  });

  it("should have proper input names for form submission", () => {
    render(<LoginForm />);

    expect(screen.getByRole("textbox", { name: /email/i })).toHaveAttribute("name", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("name", "password");
    expect(screen.getByDisplayValue("/")).toHaveAttribute("name", "redirectTo");
  });
});
