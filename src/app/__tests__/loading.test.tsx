import { render, screen } from "@testing-library/react";
import Loading from "../loading";

jest.mock("@/components/ui/LoadingPage", () => {
  return function MockLoadingPage({ message }: { message: string }) {
    return <div data-testid="loading-page">{message}</div>;
  };
});

describe("Loading", () => {
  it("should render loading page with correct message", () => {
    render(<Loading />);

    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
    expect(screen.getByText("Loading page...")).toBeInTheDocument();
  });

  it("should have correct styling classes", () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.firstChild as HTMLElement;

    expect(loadingContainer).toHaveClass(
      "min-h-screen",
      "bg-gradient-to-br",
      "from-gray-50",
      "to-gray-100",
      "dark:from-gray-900",
      "dark:to-gray-800"
    );
  });
});
