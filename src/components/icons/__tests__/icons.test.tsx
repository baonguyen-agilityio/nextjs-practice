import { render } from "@testing-library/react";
import Logo from "../logo";
import TwitterIcon from "../twitter-icon";
import CartIcon from "../cart-icon";
import FacebookIcon from "../facebook-icon";
import LinkedinIcon from "../linkedin-icon";
import CloseIcon from "../close-icon";
import MinusIcon from "../MinusIcon";
import PlusIcon from "../PlusIcon";
import ShoppingCartIcon from "../ShoppingCartIcon";

describe("Icon Components", () => {
  describe("Logo", () => {
    it("should render logo", () => {
      const { container } = render(<Logo />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("CartIcon", () => {
    it("should render cart icon", () => {
      const { container } = render(<CartIcon />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("CloseIcon", () => {
    it("should render close icon", () => {
      const { container } = render(<CloseIcon />);
      expect(container.firstChild).toBeInTheDocument();
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("width", "24");
      expect(svg).toHaveAttribute("height", "24");
    });
  });

  describe("MinusIcon", () => {
    it("should render minus icon", () => {
      const { container } = render(<MinusIcon />);
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveAttribute("data-testid", "minus-icon");
    });
  });

  describe("PlusIcon", () => {
    it("should render plus icon", () => {
      const { container } = render(<PlusIcon />);
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveAttribute("data-testid", "plus-icon");
    });
  });

  describe("ShoppingCartIcon", () => {
    it("should render shopping cart icon", () => {
      const { container } = render(<ShoppingCartIcon />);
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveAttribute("data-testid", "shopping-cart-icon");
    });
  });

  describe("Social Icons", () => {
    it("should render twitter icon with default color", () => {
      const { container } = render(<TwitterIcon />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render facebook icon with default color", () => {
      const { container } = render(<FacebookIcon />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render facebook icon with custom color", () => {
      const { container } = render(<FacebookIcon color="blue" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render linkedin icon", () => {
      const { container } = render(<LinkedinIcon />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
