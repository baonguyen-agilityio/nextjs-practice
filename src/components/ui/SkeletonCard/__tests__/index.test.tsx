import { render } from "@testing-library/react";
import SkeletonCard from "../index";

describe("SkeletonCard Component", () => {
  it("should render skeleton card", () => {
    const { container } = render(<SkeletonCard />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it("should have proper structure", () => {
    const { container } = render(<SkeletonCard />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.innerHTML).toBeTruthy();
  });
});
