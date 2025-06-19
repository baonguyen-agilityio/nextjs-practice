import { render, screen, fireEvent } from "@testing-library/react";
import { MobileMenuToggle } from "../MobileMenuToggle";

describe("MobileMenuToggle", () => {
  const mockChildren = <div data-testid="test-children">Test Children</div>;

  describe("Initial state", () => {
    it("should render toggle button and hide menu", () => {
      render(<MobileMenuToggle>{mockChildren}</MobileMenuToggle>);

      expect(screen.getByLabelText("Toggle menu")).toBeInTheDocument();
      expect(screen.queryByTestId("test-children")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Close menu")).not.toBeInTheDocument();
    });

    it("should render hamburger menu lines", () => {
      render(<MobileMenuToggle>{mockChildren}</MobileMenuToggle>);

      const toggleButton = screen.getByLabelText("Toggle menu");
      const menuLines = toggleButton.querySelectorAll("div");
      expect(menuLines).toHaveLength(3);
    });
  });

  describe("Menu interactions", () => {
    it("should open menu when toggle button is clicked", () => {
      render(<MobileMenuToggle>{mockChildren}</MobileMenuToggle>);

      fireEvent.click(screen.getByLabelText("Toggle menu"));

      expect(screen.getByTestId("test-children")).toBeInTheDocument();
      expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
    });

    it("should close menu when close button is clicked", () => {
      render(<MobileMenuToggle>{mockChildren}</MobileMenuToggle>);

      fireEvent.click(screen.getByLabelText("Toggle menu"));

      fireEvent.click(screen.getByLabelText("Close menu"));

      expect(screen.queryByTestId("test-children")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Close menu")).not.toBeInTheDocument();
    });

    it("should toggle menu multiple times", () => {
      render(<MobileMenuToggle>{mockChildren}</MobileMenuToggle>);

      const toggleButton = screen.getByLabelText("Toggle menu");

      fireEvent.click(toggleButton);
      expect(screen.getByTestId("test-children")).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText("Close menu"));
      expect(screen.queryByTestId("test-children")).not.toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.getByTestId("test-children")).toBeInTheDocument();
    });
  });

  describe("Children rendering", () => {
    it("should render children when menu is open", () => {
      render(<MobileMenuToggle>{mockChildren}</MobileMenuToggle>);

      fireEvent.click(screen.getByLabelText("Toggle menu"));

      expect(screen.getByTestId("test-children")).toBeInTheDocument();
      expect(screen.getByText("Test Children")).toBeInTheDocument();
    });

    it("should not render children when menu is closed", () => {
      render(<MobileMenuToggle>{mockChildren}</MobileMenuToggle>);

      expect(screen.queryByTestId("test-children")).not.toBeInTheDocument();
    });

    it("should handle multiple children", () => {
      const multipleChildren = (
        <>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </>
      );

      render(<MobileMenuToggle>{multipleChildren}</MobileMenuToggle>);
      fireEvent.click(screen.getByLabelText("Toggle menu"));

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("should render overlay with correct structure when open", () => {
      render(<MobileMenuToggle>{mockChildren}</MobileMenuToggle>);

      fireEvent.click(screen.getByLabelText("Toggle menu"));

      const overlay = screen.getByTestId("test-children").closest(".fixed");
      expect(overlay).toHaveClass("fixed", "inset-0", "bg-primary", "z-50");
    });

    it("should render close button with correct lines", () => {
      render(<MobileMenuToggle>{mockChildren}</MobileMenuToggle>);

      fireEvent.click(screen.getByLabelText("Toggle menu"));

      const closeButton = screen.getByLabelText("Close menu");
      const closeLines = closeButton.querySelectorAll("div");
      expect(closeLines).toHaveLength(2);
    });
  });

  describe("Edge cases", () => {
    it("should handle null children", () => {
      render(<MobileMenuToggle>{null}</MobileMenuToggle>);

      fireEvent.click(screen.getByLabelText("Toggle menu"));

      expect(document.querySelector(".fixed")).toBeInTheDocument();
    });

    it("should handle string children", () => {
      render(<MobileMenuToggle>Simple text</MobileMenuToggle>);

      fireEvent.click(screen.getByLabelText("Toggle menu"));

      expect(screen.getByText("Simple text")).toBeInTheDocument();
    });
  });
});
