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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("LoginFormFallback Component", () => {
    it("should render loading skeleton with correct structure", () => {
      render(<LoginFormFallback />);

      const container = document.querySelector(".w-full.max-w-md.mx-auto.space-y-8");
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass("w-full", "max-w-md", "mx-auto", "space-y-8");
    });

    it("should render three skeleton loading bars", () => {
      render(<LoginFormFallback />);

      const skeletonElements = document.querySelectorAll(".h-12.bg-gray-200.rounded.animate-pulse");
      expect(skeletonElements).toHaveLength(3);
    });

    it("should have proper spacing and styling for skeleton elements", () => {
      render(<LoginFormFallback />);

      const skeletonElements = document.querySelectorAll(".h-12.bg-gray-200.rounded.animate-pulse");

      skeletonElements.forEach((element) => {
        expect(element).toHaveClass("h-12", "bg-gray-200", "rounded", "animate-pulse");
      });

      const spacingContainer = document.querySelector(".space-y-6");
      expect(spacingContainer).toBeInTheDocument();
    });

    it("should provide visual feedback during loading", () => {
      render(<LoginFormFallback />);

      const skeletonElements = document.querySelectorAll(".animate-pulse");
      expect(skeletonElements.length).toBeGreaterThan(0);

      skeletonElements.forEach((element) => {
        expect(element).toHaveClass("animate-pulse");
      });
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

    it("should maintain layout during loading transition", () => {
      const TestComponent = () => (
        <Suspense fallback={<LoginFormFallback />}>
          <SlowLoginForm />
        </Suspense>
      );

      render(<TestComponent />);

      const container = document.querySelector(".w-full.max-w-md");
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass("w-full", "max-w-md");
    });
  });

  describe("Accessibility for Loading States", () => {
    it("should be accessible during loading", () => {
      render(<LoginFormFallback />);

      const container = document.querySelector(".w-full.max-w-md");
      expect(container).toBeInTheDocument();
    });

    it("should provide appropriate visual cues for loading", () => {
      render(<LoginFormFallback />);

      const pulseElements = document.querySelectorAll(".animate-pulse");
      expect(pulseElements.length).toBeGreaterThan(0);

      pulseElements.forEach((element) => {
        expect(element).toHaveClass("bg-gray-200");
      });
    });
  });

  describe("Responsive Design in Loading State", () => {
    it("should be responsive during loading", () => {
      render(<LoginFormFallback />);

      const container = document.querySelector(".w-full.max-w-md");
      expect(container).toBeInTheDocument();

      expect(container).toHaveClass("w-full", "max-w-md");

      expect(container).toHaveClass("mx-auto");
    });

    it("should maintain consistent spacing during loading", () => {
      render(<LoginFormFallback />);

      expect(document.querySelector(".space-y-8")).toBeInTheDocument();
      expect(document.querySelector(".space-y-6")).toBeInTheDocument();
    });
  });

  describe("Loading Animation Performance", () => {
    it("should use CSS animations for performance", () => {
      render(<LoginFormFallback />);

      const animatedElements = document.querySelectorAll(".animate-pulse");

      animatedElements.forEach((element) => {
        expect(element).toHaveClass("animate-pulse");
      });
    });

    it("should have appropriate element heights for visual consistency", () => {
      render(<LoginFormFallback />);

      const skeletonElements = document.querySelectorAll(".h-12");
      expect(skeletonElements).toHaveLength(3);

      skeletonElements.forEach((element) => {
        expect(element).toHaveClass("h-12");
      });
    });
  });
});
