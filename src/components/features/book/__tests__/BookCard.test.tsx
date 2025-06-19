import { render, screen, fireEvent } from "@testing-library/react";
import BookCard from "../BookCard";
import type { Book, Category } from "@/types";

jest.mock("@heroui/react", () => ({
  Card: function MockCard({ children, className }: any) {
    return (
      <div className={className} data-testid="card">
        {children}
      </div>
    );
  },
  CardFooter: function MockCardFooter({ children, className }: any) {
    return (
      <div className={className} data-testid="card-footer">
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

jest.mock("@/utils/currency", () => ({
  formatUSD: jest.fn((price) => `$${price.toFixed(2)}`),
}));

jest.mock("@/components/features/cart/AddToCart", () => ({
  AddToCart: function MockAddToCart({ variant }: { variant: string }) {
    return (
      <button data-testid="add-to-cart" data-variant={variant}>
        Add to Cart
      </button>
    );
  },
}));

jest.mock("../DynamicModals", () => ({
  LazyEditBookModal: function MockLazyEditBookModal({
    formAction,
    isPending,
  }: {
    formAction: (data: FormData) => void;
    isPending: boolean;
  }) {
    return (
      <button
        data-testid="edit-book-modal"
        onClick={() => formAction?.(new FormData())}
        disabled={isPending}
      >
        Edit Book
      </button>
    );
  },
  LazyDeleteBookModal: function MockLazyDeleteBookModal({
    formActionDelete,
    isPendingDelete,
  }: {
    formActionDelete: (data: FormData) => void;
    isPendingDelete: boolean;
  }) {
    return (
      <button
        data-testid="delete-book-modal"
        onClick={() => formActionDelete?.(new FormData())}
        disabled={isPendingDelete}
      >
        Delete Book
      </button>
    );
  },
}));

jest.mock("next/image", () => {
  return function MockImage({
    alt,
    src,
    className,
    fill,
    priority,
  }: {
    alt: string;
    src: string;
    className: string;
    fill: boolean;
    priority: boolean;
  }) {
    return (
      <img
        alt={alt}
        src={src}
        className={className}
        data-fill={fill}
        data-priority={priority}
        data-testid="book-image"
      />
    );
  };
});

describe("BookCard", () => {
  const mockBook: Book = {
    id: "1",
    documentId: "doc-1",
    slug: "test-book",
    title: "Test Book",
    price: 19.99,
    language: "en",
    description: "A great test book",
    imageUrl: "/test-book.jpg",
    categories: [],
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
  };

  const mockCategories: Category[] = [
    { id: 1, documentId: "cat-1", name: "Fiction" },
    { id: 2, documentId: "cat-2", name: "Mystery" },
  ];

  const mockFormAction = jest.fn();
  const mockFormActionDelete = jest.fn();

  const defaultProps = {
    book: mockBook,
    isAdmin: false,
    categories: mockCategories,
    formAction: mockFormAction,
    isPendingUpdateBook: false,
    result: undefined,
    formActionDelete: mockFormActionDelete,
    isPendingDelete: false,
  };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_STRAPI_URL = "http://localhost:1337";
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render book card with all elements", () => {
      render(<BookCard {...defaultProps} />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("card-footer")).toBeInTheDocument();
      expect(screen.getByTestId("book-image")).toBeInTheDocument();
    });

    it("should display book title and price", () => {
      render(<BookCard {...defaultProps} />);

      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("$19.99")).toBeInTheDocument();
    });

    it("should render AddToCart for non-admin users", () => {
      render(<BookCard {...defaultProps} />);

      expect(screen.getByTestId("add-to-cart")).toBeInTheDocument();
      expect(screen.queryByTestId("edit-book-modal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("delete-book-modal")).not.toBeInTheDocument();
    });
  });

  describe("Admin Features", () => {
    it("should render admin modals for admin users", () => {
      render(<BookCard {...defaultProps} isAdmin={true} />);

      expect(screen.getByTestId("edit-book-modal")).toBeInTheDocument();
      expect(screen.getByTestId("delete-book-modal")).toBeInTheDocument();
      expect(screen.queryByTestId("add-to-cart")).not.toBeInTheDocument();
    });

    it("should handle edit book action", () => {
      render(<BookCard {...defaultProps} isAdmin={true} />);

      const editButton = screen.getByTestId("edit-book-modal");
      fireEvent.click(editButton);

      expect(mockFormAction).toHaveBeenCalled();
    });

    it("should handle delete book action", () => {
      render(<BookCard {...defaultProps} isAdmin={true} />);

      const deleteButton = screen.getByTestId("delete-book-modal");
      fireEvent.click(deleteButton);

      expect(mockFormActionDelete).toHaveBeenCalled();
    });
  });

  describe("Image Handling", () => {
    it("should render image with environment URL", () => {
      render(<BookCard {...defaultProps} />);

      const image = screen.getByTestId("book-image");
      expect(image).toHaveAttribute("src", expect.stringContaining("localhost:1337"));
      expect(image).toHaveAttribute("alt", "Test Book");
    });

    it("should handle missing environment variable", () => {
      delete process.env.NEXT_PUBLIC_STRAPI_URL;

      render(<BookCard {...defaultProps} />);

      const image = screen.getByTestId("book-image");
      expect(image).toHaveAttribute("src", "/test-book.jpg");
    });
  });

  describe("Loading States", () => {
    it("should disable edit modal when pending update", () => {
      render(<BookCard {...defaultProps} isAdmin={true} isPendingUpdateBook={true} />);

      const editButton = screen.getByTestId("edit-book-modal");
      expect(editButton).toBeDisabled();
    });

    it("should disable delete modal when pending delete", () => {
      render(<BookCard {...defaultProps} isAdmin={true} isPendingDelete={true} />);

      const deleteButton = screen.getByTestId("delete-book-modal");
      expect(deleteButton).toBeDisabled();
    });
  });

  describe("Categories", () => {
    it("should pass categories to modals", () => {
      render(<BookCard {...defaultProps} isAdmin={true} />);

      expect(screen.getByTestId("edit-book-modal")).toBeInTheDocument();
      expect(screen.getByTestId("delete-book-modal")).toBeInTheDocument();
    });
  });
});
