import { render, screen } from "@testing-library/react";
import AboutPage from "../page";

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

describe("About Page", () => {
  it("should render about page with correct content", () => {
    render(<AboutPage />);

    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(
      screen.getByText("Learn more about our story, mission, and the team behind our platform.")
    ).toBeInTheDocument();
  });

  it("should render with EmptyState component", () => {
    render(<AboutPage />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("should have icon", () => {
    render(<AboutPage />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("should have correct container structure", () => {
    const { container } = render(<AboutPage />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("container", "mx-auto", "px-4", "py-16");
  });
});
