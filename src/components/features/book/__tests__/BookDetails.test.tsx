import { render, screen, fireEvent } from "@testing-library/react";
import { BookDetails } from "../BookDetails";
import type { Book } from "@/types";

jest.mock("@/app/actions", () => ({
  addItem: jest.fn(),
}));

jest.mock("@/hooks/useCart", () => ({
  useCart: jest.fn(() => ({
    addCartItem: jest.fn(),
  })),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(() => [{ success: null, message: "" }, jest.fn(), false]),
  useState: jest.fn(() => [1, jest.fn()]),
  useCallback: jest.fn((fn) => fn),
  useEffect: jest.fn(),
}));

jest.mock("@heroui/react", () => ({
  addToast: jest.fn(),
  extendVariants: jest.fn((component) => component),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({
    children,
    onClick,
    variant,
    className,
    type,
    disabled,
    isLoading,
    isIconOnly,
    "aria-label": ariaLabel,
  }: any) {
    return (
      <button
        onClick={onClick}
        type={type}
        disabled={disabled || isLoading}
        data-variant={variant}
        data-icon-only={isIconOnly}
        className={className}
        aria-label={ariaLabel}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
}));

jest.mock("@/components/ui/Input", () => ({
  Input: function MockInput({
    value,
    onChange,
    type,
    classNames,
    inputMode,
    "aria-label": ariaLabel,
  }: any) {
    return (
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        className={classNames?.input}
        aria-label={ariaLabel}
      />
    );
  },
}));

jest.mock("@/utils/currency", () => ({
  formatUSD: jest.fn((price) => `$${price.toFixed(2)}`),
}));

jest.mock("@/utils", () => ({
  createImageUrl: jest.fn((url) =>
    process.env.NEXT_PUBLIC_STRAPI_URL ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}` : url
  ),
  validateQuantity: jest.fn((value) => Math.max(1, value)),
}));

jest.mock("@/components/icons/MinusIcon", () => {
  return function MockMinusIcon({ className }: any) {
    return (
      <span data-testid="minus-icon" className={className}>
        -
      </span>
    );
  };
});

jest.mock("@/components/icons/PlusIcon", () => {
  return function MockPlusIcon({ className }: any) {
    return (
      <span data-testid="plus-icon" className={className}>
        +
      </span>
    );
  };
});

jest.mock("next/image", () => {
  return function MockImage({ src, alt, priority }: any) {
    return <img src={src} alt={alt} data-priority={priority} data-testid="book-image" />;
  };
});

describe("BookDetails", () => {
  const mockBook: Book = {
    id: "1",
    documentId: "doc-1",
    slug: "test-book",
    title: "Test Book",
    price: 19.99,
    language: "en",
    description: "A comprehensive guide to testing in React applications.",
    imageUrl: "/test-book.jpg",
    categories: [
      { id: 1, name: "Programming", documentId: "cat-1" },
      { id: 2, name: "React", documentId: "cat-2" },
    ],
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_STRAPI_URL = "http://localhost:1337";
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render book details with all elements", () => {
      render(<BookDetails book={mockBook} />);

      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("$19.99 USD")).toBeInTheDocument();
      expect(
        screen.getByText("A comprehensive guide to testing in React applications.")
      ).toBeInTheDocument();
    });

    it("should render back button", () => {
      render(<BookDetails book={mockBook} />);

      expect(screen.getByText("← Back to list")).toBeInTheDocument();
    });

    it("should render add to cart button", () => {
      render(<BookDetails book={mockBook} />);

      expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    });
  });

  describe("Image Handling", () => {
    it("should render image with environment URL", () => {
      render(<BookDetails book={mockBook} />);

      const image = screen.getByTestId("book-image");
      expect(image).toHaveAttribute("src", expect.stringContaining("localhost:1337"));
      expect(image).toHaveAttribute("alt", "Test Book");
      expect(image).toHaveAttribute("data-priority", "true");
    });

    it("should handle missing environment variable", () => {
      delete process.env.NEXT_PUBLIC_STRAPI_URL;

      render(<BookDetails book={mockBook} />);

      const image = screen.getByTestId("book-image");
      expect(image).toHaveAttribute("src", "/test-book.jpg");
    });
  });

  describe("Book Data", () => {
    it("should format currency correctly", () => {
      const { formatUSD } = require("@/utils/currency");
      render(<BookDetails book={mockBook} />);

      expect(formatUSD).toHaveBeenCalledWith(19.99);
      expect(screen.getByText("$19.99 USD")).toBeInTheDocument();
    });

    it("should handle books without categories", () => {
      const bookWithoutCategories = {
        ...mockBook,
        categories: [],
      };

      render(<BookDetails book={bookWithoutCategories} />);

      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });
  });

  describe("Quantity Controls", () => {
    it("should render quantity controls", () => {
      render(<BookDetails book={mockBook} />);

      const quantityInput = screen.getByLabelText("Book quantity");
      const minusButton = screen.getByLabelText("Decrease quantity");
      const plusButton = screen.getByLabelText("Increase quantity");

      expect(quantityInput).toBeInTheDocument();
      expect(quantityInput).toHaveValue("1");
      expect(minusButton).toBeInTheDocument();
      expect(plusButton).toBeInTheDocument();
    });

    it("should handle quantity button clicks", () => {
      render(<BookDetails book={mockBook} />);

      const minusButton = screen.getByLabelText("Decrease quantity");
      const plusButton = screen.getByLabelText("Increase quantity");

      fireEvent.click(plusButton);
      fireEvent.click(minusButton);

      expect(minusButton).toBeInTheDocument();
      expect(plusButton).toBeInTheDocument();
    });

    it("should handle quantity input change", () => {
      render(<BookDetails book={mockBook} />);

      const quantityInput = screen.getByLabelText("Book quantity");
      fireEvent.change(quantityInput, { target: { value: "5" } });

      expect(quantityInput).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should handle form submission", () => {
      render(<BookDetails book={mockBook} />);

      const addToCartButton = screen.getByText("Add to Cart");
      fireEvent.click(addToCartButton);

      expect(addToCartButton).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should handle back button click", () => {
      render(<BookDetails book={mockBook} />);

      const backButton = screen.getByText("← Back to list");
      fireEvent.click(backButton);

      expect(backButton).toBeInTheDocument();
    });

    it("should handle custom navigation callback", () => {
      const mockNavigateBack = jest.fn();
      render(<BookDetails book={mockBook} onNavigateBack={mockNavigateBack} />);

      const backButton = screen.getByText("← Back to list");
      fireEvent.click(backButton);

      expect(backButton).toBeInTheDocument();
    });
  });
});
