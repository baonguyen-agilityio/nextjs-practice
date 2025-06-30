import { render, screen } from "@testing-library/react";
import ContactPage from "../page";

describe("Contact Page", () => {
  it("should render contact page", () => {
    render(<ContactPage />);

    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  it("should display contact empty page content", () => {
    render(<ContactPage />);

    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });
});
