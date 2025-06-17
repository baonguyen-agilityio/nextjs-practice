import { render, screen } from "@testing-library/react";
import LoginPage, { generateMetadata } from "../page";

jest.mock("@/components/features/login/LoginForm", () => ({
  __esModule: true,
  default: () => <div data-testid="login-form">Login Form Component</div>,
}));

jest.mock("@/components/icons/logo", () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Logo</div>,
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  Suspense: ({ children }: any) => {
    return <div data-testid="suspense-wrapper">{children}</div>;
  },
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateMetadata", () => {
    it("should return correct metadata for login page", () => {
      const metadata = generateMetadata();

      expect(metadata).toEqual({
        title: "Login",
      });
    });

    it("should return metadata with title property", () => {
      const metadata = generateMetadata();

      expect(metadata).toHaveProperty("title");
      expect(typeof metadata.title).toBe("string");
    });
  });

  describe("LoginPage Component", () => {
    it("should render the main login page structure", () => {
      render(<LoginPage />);

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass("flex", "items-center", "justify-center", "min-h-screen");
    });

    it("should render the logo and brand name", () => {
      render(<LoginPage />);

      expect(screen.getByTestId("logo")).toBeInTheDocument();

      expect(screen.getByText("Pages")).toBeInTheDocument();
      expect(screen.getByText("Pages")).toHaveClass(
        "font-inter",
        "text-primary",
        "font-bold",
        "text-3xl"
      );
    });

    it("should render the page title and subtitle", () => {
      render(<LoginPage />);

      expect(screen.getByText("Please log in to continue")).toBeInTheDocument();
      expect(screen.getByText("Please log in to continue")).toHaveClass("text-xl", "text-gray-600");
    });

    it("should render the LoginForm component within Suspense", () => {
      render(<LoginPage />);

      expect(screen.getByTestId("suspense-wrapper")).toBeInTheDocument();

      expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });

    it("should have correct CSS classes for styling", () => {
      render(<LoginPage />);

      const main = screen.getByRole("main");
      expect(main).toHaveClass(
        "flex",
        "items-center",
        "justify-center",
        "min-h-screen",
        "py-12",
        "bg-gray-50",
        "font-inter"
      );

      const cardContainer = main.querySelector("div.p-8");
      expect(cardContainer).toHaveClass(
        "p-8",
        "bg-white",
        "rounded-lg",
        "shadow-md",
        "w-full",
        "max-w-md"
      );
    });

    it("should have proper semantic structure", () => {
      render(<LoginPage />);

      expect(screen.getByRole("main")).toBeInTheDocument();

      const subtitle = screen.getByText("Please log in to continue");
      expect(subtitle.tagName).toBe("H2");
    });

    it("should render brand section with logo and text", () => {
      render(<LoginPage />);

      const logo = screen.getByTestId("logo");
      const brandText = screen.getByText("Pages");

      expect(logo).toBeInTheDocument();
      expect(brandText).toBeInTheDocument();

      const brandContainer = logo.parentElement;
      expect(brandContainer).toHaveClass("flex", "items-center", "gap-2");
    });

    it("should have responsive design classes", () => {
      render(<LoginPage />);

      const main = screen.getByRole("main");
      const cardContainer = main.querySelector("div.w-full.max-w-md");

      expect(cardContainer).toHaveClass("w-full", "max-w-md");
    });

    it("should center content properly", () => {
      render(<LoginPage />);

      const main = screen.getByRole("main");
      expect(main).toHaveClass("flex", "items-center", "justify-center");

      const headerContainer = screen.getByText("Pages").closest("div.flex.flex-col.items-center");
      expect(headerContainer).toHaveClass("flex", "flex-col", "items-center");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<LoginPage />);

      const subtitle = screen.getByRole("heading", { level: 2 });
      expect(subtitle).toHaveTextContent("Please log in to continue");
    });

    it("should have main landmark", () => {
      render(<LoginPage />);

      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should have appropriate text contrast classes", () => {
      render(<LoginPage />);

      const subtitle = screen.getByText("Please log in to continue");
      expect(subtitle).toHaveClass("text-gray-600");

      const brandText = screen.getByText("Pages");
      expect(brandText).toHaveClass("text-primary");
    });
  });

  describe("Layout and Styling", () => {
    it("should apply correct background styling", () => {
      render(<LoginPage />);

      const main = screen.getByRole("main");
      expect(main).toHaveClass("bg-gray-50");

      const card = main.querySelector("div.bg-white");
      expect(card).toHaveClass("bg-white", "rounded-lg", "shadow-md");
    });

    it("should have proper spacing classes", () => {
      render(<LoginPage />);

      const main = screen.getByRole("main");
      expect(main).toHaveClass("py-12");

      const card = main.querySelector("div.p-8");
      expect(card).toHaveClass("p-8");

      const brandContainer = screen.getByText("Pages").closest("div.mb-2");
      expect(brandContainer).toHaveClass("mb-2");
    });

    it("should use consistent font classes", () => {
      render(<LoginPage />);

      const main = screen.getByRole("main");
      expect(main).toHaveClass("font-inter");

      const brandText = screen.getByText("Pages");
      expect(brandText).toHaveClass("font-inter");
    });
  });
});

describe("LoginFormFallback", () => {
  it("should be available as fallback for Suspense", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("suspense-wrapper")).toBeInTheDocument();
  });
});
