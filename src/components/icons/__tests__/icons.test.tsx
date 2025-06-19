import { render } from "@testing-library/react";
import Logo from "../logo";
import TwitterIcon from "../twitter-icon";
import CartIcon from "../cart-icon";
import FacebookIcon from "../facebook-icon";
import LinkedinIcon from "../linkedin-icon";

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
