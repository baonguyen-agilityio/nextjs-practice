import { render, screen, fireEvent } from "@testing-library/react";
import BooksError from "../error";

jest.mock("@/components/ui/ErrorPage", () => {
  return function MockErrorPage({ title, message, onRetry }: any) {
    return (
      <div data-testid="error-page">
        <h1 data-testid="error-title">{title}</h1>
        <p data-testid="error-message">{message}</p>
        {onRetry && (
          <button onClick={onRetry} data-testid="retry-button">
            Try Again
          </button>
        )}
      </div>
    );
  };
});

describe("BooksError", () => {
  const mockReset = jest.fn();
  const mockError = new Error("Test error");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<BooksError error={mockError} reset={mockReset} />);

    expect(screen.getByTestId("error-page")).toBeInTheDocument();
  });

  it("renders ErrorPage with correct title", () => {
    render(<BooksError error={mockError} reset={mockReset} />);

    expect(screen.getByTestId("error-title")).toHaveTextContent("Failed to Load Books");
  });

  it("renders ErrorPage with correct message", () => {
    render(<BooksError error={mockError} reset={mockReset} />);

    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "We're having trouble loading our book collection right now. Please try again."
    );
  });

  it("passes reset function as onRetry prop", () => {
    render(<BooksError error={mockError} reset={mockReset} />);

    const retryButton = screen.getByTestId("retry-button");
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("handles error prop correctly", () => {
    const errorWithDigest = new Error("Test error with digest") as Error & { digest?: string };
    errorWithDigest.digest = "abc123";

    render(<BooksError error={errorWithDigest} reset={mockReset} />);

    expect(screen.getByTestId("error-page")).toBeInTheDocument();
    expect(screen.getByTestId("error-title")).toHaveTextContent("Failed to Load Books");
  });

  it("works with minimal error object", () => {
    const minimalError = new Error("Minimal error");

    render(<BooksError error={minimalError} reset={mockReset} />);

    expect(screen.getByTestId("error-page")).toBeInTheDocument();
    expect(screen.getByTestId("retry-button")).toBeInTheDocument();
  });
});
