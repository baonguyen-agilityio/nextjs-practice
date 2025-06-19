// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Setup TextEncoder and TextDecoder for Jest environment
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (!global.fetch) {
  global.fetch = jest.fn();
}

jest.mock("@/components/icons/MinusIcon", () => {
  return function MockMinusIcon({ className }) {
    return (
      <div data-testid="minus-icon" className={className}>
        -
      </div>
    );
  };
});

jest.mock("@/components/icons/PlusIcon", () => {
  return function MockPlusIcon({ className }) {
    return (
      <div data-testid="plus-icon" className={className}>
        +
      </div>
    );
  };
});

jest.mock("@/components/icons/ShoppingCartIcon", () => {
  return function MockShoppingCartIcon({ className }) {
    return (
      <div data-testid="shopping-cart-icon" className={className}>
        🛒
      </div>
    );
  };
});
