import { render, screen } from "@testing-library/react";
import ArticleSkeleton from "../ArticleSkeleton";

jest.mock("@heroui/react", () => ({
  Card: function MockCard({ children, className, radius, shadow }: any) {
    return (
      <div className={className} data-radius={radius} data-shadow={shadow} data-testid="card">
        {children}
      </div>
    );
  },
  Skeleton: function MockSkeleton({ children, className }: any) {
    return (
      <div className={className} data-testid="skeleton">
        {children}
      </div>
    );
  },
}));

describe("ArticleSkeleton", () => {
  it("should render skeleton structure", () => {
    const { container } = render(<ArticleSkeleton />);

    expect(container.querySelector("section")).toBeInTheDocument();
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("should have correct container classes", () => {
    const { container } = render(<ArticleSkeleton />);

    const section = container.querySelector("section");
    expect(section).toHaveClass("container", "mx-auto", "px-4", "max-w-7xl");
  });

  it("should have correct padding classes", () => {
    const { container } = render(<ArticleSkeleton />);

    const paddingDiv = container.querySelector(".py-10");
    expect(paddingDiv).toBeInTheDocument();
    expect(paddingDiv).toHaveClass("py-10", "md:p-16", "lg:p-20");
  });

  it("should render card with correct props", () => {
    render(<ArticleSkeleton />);

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("space-y-5", "p-4");
    expect(card).toHaveAttribute("data-radius", "lg");
    expect(card).toHaveAttribute("data-shadow", "none");
  });

  it("should render multiple skeleton elements", () => {
    render(<ArticleSkeleton />);

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons).toHaveLength(4); // 1 main image + 3 text lines
  });

  it("should render image skeleton with correct classes", () => {
    const { container } = render(<ArticleSkeleton />);

    const imageDiv = container.querySelector(".h-64");
    expect(imageDiv).toBeInTheDocument();
    expect(imageDiv).toHaveClass("h-64", "rounded-lg", "bg-default-300");
  });

  it("should render text skeletons with different widths", () => {
    const { container } = render(<ArticleSkeleton />);

    const textSkeleton1 = container.querySelector(".w-3\\/5");
    const textSkeleton2 = container.querySelector(".w-4\\/5");
    const textSkeleton3 = container.querySelector(".w-2\\/5");

    expect(textSkeleton1).toBeInTheDocument();
    expect(textSkeleton2).toBeInTheDocument();
    expect(textSkeleton3).toBeInTheDocument();
  });

  it("should have proper spacing between elements", () => {
    const { container } = render(<ArticleSkeleton />);

    const spacingDiv = container.querySelector(".space-y-3");
    expect(spacingDiv).toBeInTheDocument();
    expect(spacingDiv).toHaveClass("space-y-3");
  });

  it("should render text skeleton lines with correct background colors", () => {
    const { container } = render(<ArticleSkeleton />);

    const defaultColor200 = container.querySelectorAll(".bg-default-200");
    const defaultColor300 = container.querySelectorAll(".bg-default-300");

    expect(defaultColor200).toHaveLength(2);
    expect(defaultColor300).toHaveLength(2); // Image skeleton + last text line
  });

  it("should have accessible structure", () => {
    const { container } = render(<ArticleSkeleton />);

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should be responsive", () => {
    const { container } = render(<ArticleSkeleton />);

    const responsiveDiv = container.querySelector(".py-10.md\\:p-16.lg\\:p-20");
    expect(responsiveDiv).toBeInTheDocument();
  });

  it("should have consistent rounded corners", () => {
    const { container } = render(<ArticleSkeleton />);

    const roundedElements = container.querySelectorAll(".rounded-lg");
    expect(roundedElements.length).toBeGreaterThan(0);
  });

  it("should maintain proper component structure", () => {
    const { container } = render(<ArticleSkeleton />);

    expect(container.querySelector("section")).toBeInTheDocument();
    expect(container.querySelector("section > div")).toBeInTheDocument();
    expect(container.querySelector("section > div > div[data-testid='card']")).toBeInTheDocument();
  });
});
