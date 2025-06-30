import { render, screen } from "@testing-library/react";
import ServicesPage from "../page";

jest.mock("@/components/ui/EmptyState", () => {
  return function MockEmptyState({ title, message, icon }: any) {
    return (
      <div data-testid="empty-state">
        <h1>{title}</h1>
        <p>{message}</p>
        {icon && <div data-testid="icon">{icon}</div>}
      </div>
    );
  };
});

describe("Services Page", () => {
  it("should render services page with correct content", () => {
    render(<ServicesPage />);

    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(
      screen.getByText("We're working on it! Check back soon for updates.")
    ).toBeInTheDocument();
  });

  it("should render with EmptyState component", () => {
    render(<ServicesPage />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("should have icon", () => {
    render(<ServicesPage />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("should have correct container structure", () => {
    const { container } = render(<ServicesPage />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("container", "mx-auto", "px-4", "py-16");
  });
});
