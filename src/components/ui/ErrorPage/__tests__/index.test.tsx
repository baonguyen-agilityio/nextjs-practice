import { render, screen, fireEvent } from "@testing-library/react";
import ErrorPage from "../index";

describe("ErrorPage Component", () => {
  it("should render with default props", () => {
    render(<ErrorPage />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("An error occurred while loading this page.")).toBeInTheDocument();
  });

  it("should render with custom title and message", () => {
    render(<ErrorPage title="Custom Error" message="Custom error message" />);

    expect(screen.getByText("Custom Error")).toBeInTheDocument();
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("should render retry button by default", () => {
    const onRetry = jest.fn();
    render(<ErrorPage onRetry={onRetry} />);

    const retryButton = screen.getByText("Try Again");
    expect(retryButton).toBeInTheDocument();
  });

  it("should call onRetry when retry button is clicked", () => {
    const onRetry = jest.fn();
    render(<ErrorPage onRetry={onRetry} />);

    const retryButton = screen.getByText("Try Again");
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("should not render retry button when showRetryButton is false", () => {
    const onRetry = jest.fn();
    render(<ErrorPage onRetry={onRetry} showRetryButton={false} />);

    expect(screen.queryByText("Try Again")).not.toBeInTheDocument();
  });

  it("should not render retry button when onRetry is not provided", () => {
    render(<ErrorPage />);

    expect(screen.queryByText("Try Again")).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<ErrorPage className="custom-error-class" />);

    const errorDiv = container.firstChild as HTMLElement;
    expect(errorDiv).toHaveClass("custom-error-class");
  });

  it("should have error icon", () => {
    const { container } = render(<ErrorPage />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("w-8", "h-8", "text-red-600");
  });
});
