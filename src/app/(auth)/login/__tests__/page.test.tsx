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
  describe("generateMetadata", () => {
    it("should return correct metadata for login page", () => {
      const metadata = generateMetadata();

      expect(metadata).toEqual({
        title: "Login",
        description:
          "Sign in to your BookStore account to access your wishlist, order history, and personalized book recommendations.",
        robots: {
          index: false,
          follow: true,
        },
        openGraph: {
          title: "Login | BookStore",
          description:
            "Sign in to your BookStore account to access your personalized book recommendations and order history.",
          type: "website",
        },
      });
    });
  });

  describe("LoginPage Component", () => {
    it("should render the main login page", () => {
      render(<LoginPage />);

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("should render the logo and brand name", () => {
      render(<LoginPage />);

      expect(screen.getByTestId("logo")).toBeInTheDocument();
      expect(screen.getByText("Pages")).toBeInTheDocument();
    });

    it("should render the page title", () => {
      render(<LoginPage />);

      expect(screen.getByText("Please log in to continue")).toBeInTheDocument();
    });

    it("should render the LoginForm component", () => {
      render(<LoginPage />);

      expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });

    it("should render within Suspense wrapper", () => {
      render(<LoginPage />);

      expect(screen.getByTestId("suspense-wrapper")).toBeInTheDocument();
    });
  });
});
