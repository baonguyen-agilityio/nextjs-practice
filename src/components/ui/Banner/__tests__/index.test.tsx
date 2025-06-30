import { render, screen } from "@testing-library/react";
import { Banner } from "../index";

describe("Banner Component", () => {
  it("should render banner with title", () => {
    render(<Banner title="Test Title" />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Title");
  });

  it("should render banner with title and description", () => {
    render(<Banner title="Test Title" description="Test description" />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("should apply correct CSS classes", () => {
    const { container } = render(<Banner title="Test Title" description="Test description" />);

    const bannerDiv = container.firstChild as HTMLElement;
    expect(bannerDiv).toHaveClass("bg-primary", "text-white", "py-16");
  });

  it("should render without description", () => {
    render(<Banner title="Only Title" />);

    expect(screen.getByText("Only Title")).toBeInTheDocument();
    expect(screen.queryByText("Test description")).not.toBeInTheDocument();
  });
});
