import { render, screen } from "@testing-library/react";
import LoadingPage from "../index";

describe("LoadingPage Component", () => {
  it("should render with default message", () => {
    render(<LoadingPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render with custom message", () => {
    render(<LoadingPage message="Please wait..." />);

    expect(screen.getByText("Please wait...")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<LoadingPage className="custom-class" />);

    const loadingDiv = container.firstChild as HTMLElement;
    expect(loadingDiv).toHaveClass("custom-class");
  });

  it("should have loading spinner", () => {
    const { container } = render(<LoadingPage />);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("border-4", "border-gray-200", "border-t-blue-600", "rounded-full");
  });

  it("should apply default CSS classes", () => {
    const { container } = render(<LoadingPage />);

    const loadingDiv = container.firstChild as HTMLElement;
    expect(loadingDiv).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "min-h-[400px]"
    );
  });
});
