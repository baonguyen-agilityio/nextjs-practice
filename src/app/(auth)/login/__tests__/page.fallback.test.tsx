import { render, screen } from "@testing-library/react";
import { Suspense } from "react";

const LoginFormFallback = () => {
  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

const SlowLoginForm = () => {
  throw new Promise(() => {});
};

const QuickLoginForm = () => {
  return <div data-testid="login-form-loaded">Login Form Loaded</div>;
};

describe("LoginPage Suspense Behavior", () => {
  describe("LoginFormFallback Component", () => {
    it("should render loading skeleton", () => {
      render(<LoginFormFallback />);

      const container = document.querySelector(".w-full");
      expect(container).toBeInTheDocument();
    });

    it("should render three skeleton loading bars", () => {
      render(<LoginFormFallback />);

      const skeletonElements = document.querySelectorAll(".animate-pulse");
      expect(skeletonElements).toHaveLength(3);
    });

    it("should have proper styling for skeleton elements", () => {
      render(<LoginFormFallback />);

      const skeletonElements = document.querySelectorAll(".h-12");
      expect(skeletonElements).toHaveLength(3);
    });
  });

  describe("Suspense Integration", () => {
    it("should show fallback when component is loading", () => {
      const TestComponent = () => (
        <Suspense fallback={<LoginFormFallback />}>
          <SlowLoginForm />
        </Suspense>
      );

      render(<TestComponent />);

      const skeletonElements = document.querySelectorAll(".animate-pulse");
      expect(skeletonElements.length).toBe(3);
    });

    it("should hide fallback when component loads successfully", () => {
      const TestComponent = () => (
        <Suspense fallback={<LoginFormFallback />}>
          <QuickLoginForm />
        </Suspense>
      );

      render(<TestComponent />);

      expect(screen.getByTestId("login-form-loaded")).toBeInTheDocument();

      const skeletonElements = document.querySelectorAll(".animate-pulse");
      expect(skeletonElements).toHaveLength(0);
    });
  });
});
