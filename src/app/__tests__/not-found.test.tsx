import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import NotFound from "../not-found";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/ui/EmptyState/variants", () => ({
  NotFoundEmptyState: ({ onGoHome }: { onGoHome: () => void }) => (
    <div data-testid="not-found-empty-state">
      <button onClick={onGoHome} data-testid="go-home-button">
        Go Home
      </button>
    </div>
  ),
}));

describe("NotFound", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("should render not found empty state", () => {
    render(<NotFound />);

    expect(screen.getByTestId("not-found-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("go-home-button")).toBeInTheDocument();
  });

  it("should navigate to home when go home is clicked", () => {
    render(<NotFound />);

    const goHomeButton = screen.getByTestId("go-home-button");
    goHomeButton.click();

    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("should have correct container styling", () => {
    const { container } = render(<NotFound />);
    const notFoundContainer = container.firstChild as HTMLElement;

    expect(notFoundContainer).toHaveClass("flex", "items-center", "justify-center", "px-4");
  });
});
