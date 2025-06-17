import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BookDetails, createImageUrl, validateQuantity, handleNavigation } from "../BookDetails";
import type { Book } from "@/types";

const mockAddCartItem = jest.fn();
const mockFormAction = jest.fn();

jest.mock("@/hooks/useCart", () => ({
  useCart: () => ({
    addCartItem: mockAddCartItem,
  }),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(() => [null, jest.fn(), false]),
  useState: jest.fn(),
}));

jest.mock("@/app/actions", () => ({
  addItem: jest.fn(),
}));

jest.mock("@/utils/currency", () => ({
  formatUSD: jest.fn((price) => `$${price}`),
}));

jest.mock("next/image", () => {
  return function MockImage({ src, alt, width, height }: any) {
    return <img src={src} alt={alt} width={width} height={height} data-testid="book-image" />;
  };
});

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({
    children,
    onClick,
    variant,
    isIconOnly,
    isLoading,
    isDisabled,
    type,
    fullWidth,
    color,
    className,
  }: any) {
    return (
      <button
        onClick={onClick}
        type={type}
        disabled={isDisabled}
        data-testid="button"
        data-variant={variant}
        data-icon-only={isIconOnly}
        data-loading={isLoading}
        data-full-width={fullWidth}
        data-color={color}
        className={className}
      >
        {children}
      </button>
    );
  },
}));

jest.mock("@/components/ui/Input", () => ({
  Input: function MockInput({
    value,
    onChange,
    type,
    inputMode,
    classNames,
    disableAnimation,
  }: any) {
    return (
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        data-testid="quantity-input"
        data-disable-animation={disableAnimation}
        className={classNames?.input}
      />
    );
  },
}));

jest.mock("@heroicons/react/24/outline", () => ({
  MinusIcon: function MockMinusIcon({ className }: any) {
    return (
      <div data-testid="minus-icon" className={className}>
        -
      </div>
    );
  },
  PlusIcon: function MockPlusIcon({ className }: any) {
    return (
      <div data-testid="plus-icon" className={className}>
        +
      </div>
    );
  },
}));

Object.defineProperty(window, "history", {
  value: {
    back: jest.fn(),
  },
  writable: true,
});

describe("BookDetails", () => {
  const mockBook: Book = {
    id: "1",
    documentId: "doc-1",
    slug: "test-book",
    title: "Test Book",
    description: "A test book description",
    price: 29.99,
    language: "English",
    imageUrl: "/test-image.jpg",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
    categories: [{ id: 1, name: "Fiction", documentId: "doc-cat-1" }],
  };

  let mockSetQuantity: jest.Mock;

  beforeEach(() => {
    mockSetQuantity = jest.fn();
    const { useState, useActionState } = require("react");
    useState.mockImplementation((initial: any) => [initial, mockSetQuantity]);
    useActionState.mockReturnValue([null, mockFormAction, false]);

    jest.clearAllMocks();

    process.env.NEXT_PUBLIC_STRAPI_URL = "http://localhost:1337";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_STRAPI_URL;
  });

  describe("Helper Functions", () => {
    describe("createImageUrl", () => {
      it("should create image URL with base URL", () => {
        const result = createImageUrl("http://localhost:1337", "/test.jpg");
        expect(result).toBe("http://localhost:1337/test.jpg");
      });

      it("should handle undefined base URL", () => {
        const result = createImageUrl(undefined, "/test.jpg");
        expect(result).toBe("/test.jpg");
      });

      it("should handle empty base URL", () => {
        const result = createImageUrl("", "/test.jpg");
        expect(result).toBe("/test.jpg");
      });
    });

    describe("validateQuantity", () => {
      it("should return value within bounds", () => {
        expect(validateQuantity(5)).toBe(5);
      });

      it("should clamp to minimum value", () => {
        expect(validateQuantity(0)).toBe(1);
        expect(validateQuantity(-5)).toBe(1);
      });

      it("should clamp to maximum value", () => {
        expect(validateQuantity(15)).toBe(10);
        expect(validateQuantity(100)).toBe(10);
      });
    });

    describe("handleNavigation", () => {
      it("should call custom navigation function when provided", () => {
        const mockNavigate = jest.fn();
        handleNavigation(mockNavigate);
        expect(mockNavigate).toHaveBeenCalled();
        expect(window.history.back).not.toHaveBeenCalled();
      });

      it("should call window.history.back when no custom function provided", () => {
        handleNavigation();
        expect(window.history.back).toHaveBeenCalled();
      });
    });
  });

  describe("Component Rendering", () => {
    it("should render book details correctly", () => {
      render(<BookDetails book={mockBook} />);

      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("$29.99 USD")).toBeInTheDocument();
      expect(screen.getByText("A test book description")).toBeInTheDocument();
    });

    it("should render book image with correct props", () => {
      render(<BookDetails book={mockBook} />);

      const image = screen.getByTestId("book-image");
      expect(image).toHaveAttribute("src", "http://localhost:1337/test-image.jpg");
      expect(image).toHaveAttribute("alt", "Test Book");
      expect(image).toHaveAttribute("width", "580");
      expect(image).toHaveAttribute("height", "660");
    });

    it("should use custom navigation when provided", () => {
      const mockNavigate = jest.fn();
      render(<BookDetails book={mockBook} onNavigateBack={mockNavigate} />);

      const backButton = screen.getByText("← Back to list");
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalled();
      expect(window.history.back).not.toHaveBeenCalled();
    });

    it("should use default navigation when not provided", () => {
      render(<BookDetails book={mockBook} />);

      const backButton = screen.getByText("← Back to list");
      fireEvent.click(backButton);

      expect(window.history.back).toHaveBeenCalled();
    });
  });

  describe("Quantity Management", () => {
    it("should handle plus button click to increase quantity", () => {
      mockSetQuantity.mockImplementation((updateFn) => {
        if (typeof updateFn === "function") {
          const result = updateFn(1);
          expect(result).toBe(2);
        }
      });

      render(<BookDetails book={mockBook} />);

      const plusButtons = screen.getAllByTestId("button");
      const plusButton = plusButtons.find((btn) => btn.querySelector('[data-testid="plus-icon"]'));

      fireEvent.click(plusButton!);
      expect(mockSetQuantity).toHaveBeenCalled();
    });

    it("should handle minus button click to decrease quantity", () => {
      const { useState } = require("react");
      useState.mockImplementation((initial: any) => [2, mockSetQuantity]);

      mockSetQuantity.mockImplementation((updateFn) => {
        if (typeof updateFn === "function") {
          const result = updateFn(2);
          expect(result).toBe(1);
        }
      });

      render(<BookDetails book={mockBook} />);

      const minusButtons = screen.getAllByTestId("button");
      const minusButton = minusButtons.find((btn) =>
        btn.querySelector('[data-testid="minus-icon"]')
      );

      fireEvent.click(minusButton!);
      expect(mockSetQuantity).toHaveBeenCalled();
    });

    it("should handle quantity input change", () => {
      render(<BookDetails book={mockBook} />);

      const input = screen.getByTestId("quantity-input");
      fireEvent.change(input, { target: { value: "5" } });

      expect(mockSetQuantity).toHaveBeenCalledWith(5);
    });
  });

  describe("Form and Actions", () => {
    it("should handle form submission", async () => {
      const { useState } = require("react");
      useState.mockImplementation((initial: any) => [2, mockSetQuantity]);

      render(<BookDetails book={mockBook} />);

      const form = screen.getByTestId("quantity-input").closest("form");
      expect(form).toBeInTheDocument();

      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockAddCartItem).toHaveBeenCalledWith(mockBook, 2);
      });
    });

    it("should show loading state when form is pending", () => {
      const { useActionState } = require("react");
      useActionState.mockReturnValue([null, mockFormAction, true]);

      render(<BookDetails book={mockBook} />);

      const addToCartButton = screen.getByText("Add to Cart");
      expect(addToCartButton).toHaveAttribute("data-loading", "true");
    });

    it("should disable add to cart button when quantity is 0", () => {
      const { useState } = require("react");
      useState.mockImplementation((initial: any) => [0, mockSetQuantity]);

      render(<BookDetails book={mockBook} />);

      const addToCartButton = screen.getByText("Add to Cart");
      expect(addToCartButton).toBeDisabled();
    });
  });

  describe("Layout and Styling", () => {
    it("should render correct CSS classes for layout", () => {
      const { container } = render(<BookDetails book={mockBook} />);

      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();

      const backButtonContainer = container.querySelector(".flex.justify-between.mb-10");
      expect(backButtonContainer).toBeInTheDocument();

      const mainContainer = container.querySelector(".flex.justify-between.gap-10");
      expect(mainContainer).toBeInTheDocument();
    });

    it("should format price correctly", () => {
      const { formatUSD } = require("@/utils/currency");
      formatUSD.mockReturnValue("$29.99");

      render(<BookDetails book={mockBook} />);

      expect(formatUSD).toHaveBeenCalledWith(29.99);
      expect(screen.getByText("$29.99 USD")).toBeInTheDocument();
    });
  });
});
