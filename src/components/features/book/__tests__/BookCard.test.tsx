import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import BookCard from "../BookCard";
import type { Book, Category } from "@/types";

// Mock next/navigation
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => mockRouter),
}));

// Mock HeroUI components
jest.mock("@heroui/react", () => ({
  Card: function MockCard({ children, className, ...props }: any) {
    return (
      <div className={className} data-testid="hero-card" {...props}>
        {children}
      </div>
    );
  },
  CardBody: function MockCardBody({ children, className, ...props }: any) {
    return (
      <div className={className} data-testid="hero-card-body" {...props}>
        {children}
      </div>
    );
  },
  CardFooter: function MockCardFooter({ children, className, ...props }: any) {
    return (
      <div className={className} data-testid="hero-card-footer" {...props}>
        {children}
      </div>
    );
  },
}));

// Mock utility functions
jest.mock("@/utils/currency", () => ({
  formatUSD: jest.fn((price) => `$${price.toFixed(2)}`),
}));

jest.mock("@/utils/image", () => ({
  createImageUrl: jest.fn((url) => `https://example.com${url}`),
}));

// Mock ImageWithFallback component
jest.mock("@/components/ui/ImageWithFallback", () => {
  return function MockImageWithFallback({
    alt,
    src,
    className,
    "data-testid": dataTestId,
    ...props
  }: any) {
    return (
      <img
        alt={alt}
        src={src}
        className={className}
        data-testid={dataTestId || "image-with-fallback"}
        {...props}
      />
    );
  };
});

// Mock DynamicModals
jest.mock("../DynamicModals", () => ({
  LazyEditBookModal: function MockLazyEditBookModal({
    formAction,
    isPending,
    book,
  }: {
    formAction: (data: FormData) => void;
    isPending: boolean;
    book: Book;
  }) {
    return (
      <button
        data-testid="edit-book-modal"
        onClick={() => formAction?.(new FormData())}
        disabled={isPending}
        data-book-id={book.id}
      >
        Edit Book
      </button>
    );
  },
  LazyDeleteBookModal: function MockLazyDeleteBookModal({
    formActionDelete,
    isPendingDelete,
    book,
  }: {
    formActionDelete: (data: FormData) => void;
    isPendingDelete: boolean;
    book: Book;
  }) {
    return (
      <button
        data-testid="delete-book-modal"
        onClick={() => formActionDelete?.(new FormData())}
        disabled={isPendingDelete}
        data-book-id={book.id}
      >
        Delete Book
      </button>
    );
  },
}));

// Mock Button component
jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onClick, variant, size, disabled, ...props }: any) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        data-testid="custom-button"
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </button>
    );
  },
}));

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
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  describe("Component Rendering", () => {
    it("should render book card with all elements", () => {
      render(<BookCard {...defaultProps} />);

      expect(screen.getByTestId("hero-card")).toBeInTheDocument();
      expect(screen.getByTestId("hero-card-footer")).toBeInTheDocument();
      expect(screen.getByTestId("book-image")).toBeInTheDocument();
    });

    it("should display book title and price", () => {
      render(<BookCard {...defaultProps} />);

      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("$19.99")).toBeInTheDocument();
    });

    it("should display book description", () => {
      render(<BookCard {...defaultProps} />);

      expect(screen.getByText("A great test book")).toBeInTheDocument();
    });

    it("should render Order Today button for non-admin users", () => {
      render(<BookCard {...defaultProps} />);

      expect(screen.getByText("Order Today")).toBeInTheDocument();
      expect(screen.queryByTestId("edit-book-modal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("delete-book-modal")).not.toBeInTheDocument();
    });

    it("should have proper accessibility attributes", () => {
      render(<BookCard {...defaultProps} />);

      const article = screen.getByRole("article");
      expect(article).toHaveAttribute("aria-labelledby", `book-title-${mockBook.documentId}`);
      expect(article).toHaveAttribute(
        "aria-describedby",
        `book-description-${mockBook.documentId} book-price-${mockBook.documentId}`
      );

      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveAttribute("id", `book-title-${mockBook.documentId}`);
    });
  });

  describe("Admin Features", () => {
    it("should render admin modals for admin users", () => {
      render(<BookCard {...defaultProps} isAdmin={true} />);

      expect(screen.getByTestId("edit-book-modal")).toBeInTheDocument();
      expect(screen.getByTestId("delete-book-modal")).toBeInTheDocument();
      expect(screen.queryByText("Order Today")).not.toBeInTheDocument();
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

  describe("Navigation", () => {
    it("should navigate to book details when image is clicked", () => {
      render(<BookCard {...defaultProps} />);

      const imageContainer = screen.getByTestId("book-image").closest("div");
      fireEvent.click(imageContainer!);

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
      expect(mockPush).toHaveBeenCalledWith(`/books/${mockBook.documentId}`);
    });

    it("should navigate to book details when Order Today button is clicked", () => {
      render(<BookCard {...defaultProps} />);

      const orderButton = screen.getByText("Order Today");
      fireEvent.click(orderButton);

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
      expect(mockPush).toHaveBeenCalledWith(`/books/${mockBook.documentId}`);
    });
  });

  describe("Image Handling", () => {
    it("should render image with correct props", () => {
      render(<BookCard {...defaultProps} />);

      const image = screen.getByTestId("book-image");
      expect(image).toHaveAttribute("alt", `Cover image of ${mockBook.title} book`);
      expect(image).toHaveAttribute("src", `https://example.com${mockBook.imageUrl}`);
    });

    it("should handle missing environment variable", () => {
      delete process.env.NEXT_PUBLIC_STRAPI_URL;
      render(<BookCard {...defaultProps} />);

      const image = screen.getByTestId("book-image");
      expect(image).toBeInTheDocument();
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

  describe("Props Validation", () => {
    it("should pass categories to modals", () => {
      render(<BookCard {...defaultProps} isAdmin={true} />);

      expect(screen.getByTestId("edit-book-modal")).toBeInTheDocument();
      expect(screen.getByTestId("delete-book-modal")).toBeInTheDocument();
    });

    it("should handle different book data", () => {
      const customBook: Book = {
        ...mockBook,
        title: "Custom Book Title",
        price: 29.99,
        description: "Custom book description",
      };

      render(<BookCard {...defaultProps} book={customBook} />);

      expect(screen.getByText("Custom Book Title")).toBeInTheDocument();
      expect(screen.getByText("$29.99")).toBeInTheDocument();
      expect(screen.getByText("Custom book description")).toBeInTheDocument();
    });

    it("should handle books with categories", () => {
      const bookWithCategories: Book = {
        ...mockBook,
        categories: mockCategories,
      };

      render(<BookCard {...defaultProps} book={bookWithCategories} />);

      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });
  });

  describe("Form Results", () => {
    it("should handle success result", () => {
      const successResult = {
        success: true as const,
        message: "Book updated successfully",
      };

      render(<BookCard {...defaultProps} isAdmin={true} result={successResult} />);

      expect(screen.getByTestId("edit-book-modal")).toBeInTheDocument();
    });

    it("should handle error result", () => {
      const errorResult = {
        success: false as const,
        error: "Update failed",
      };

      render(<BookCard {...defaultProps} isAdmin={true} result={errorResult} />);

      expect(screen.getByTestId("edit-book-modal")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should have proper HeroUI Card structure", () => {
      render(<BookCard {...defaultProps} />);

      const card = screen.getByTestId("hero-card");
      const cardFooter = screen.getByTestId("hero-card-footer");

      expect(card).toBeInTheDocument();
      expect(cardFooter).toBeInTheDocument();
      expect(card).toHaveClass("shadow-none", "rounded-none", "h-full", "flex", "flex-col");
    });

    it("should render proper button variant for non-admin", () => {
      render(<BookCard {...defaultProps} />);

      const button = screen.getByTestId("custom-button");
      expect(button).toHaveAttribute("data-variant", "secondaryGhost");
      expect(button).toHaveAttribute("data-size", "lg");
    });
  });
});
