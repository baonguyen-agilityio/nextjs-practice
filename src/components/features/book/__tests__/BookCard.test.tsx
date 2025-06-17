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

jest.mock("@/components/features/book/EditBookModal", () => {
  return function MockEditBookModal({
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
  };
});

jest.mock("../DeleteBookModal", () => {
  return function MockDeleteBookModal({
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
  };
});

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

  it("should display book description", () => {
    render(<BookCard {...defaultProps} />);

    expect(screen.getByText("A great test book")).toBeInTheDocument();
  });

  it("should render image with correct props", () => {
    render(<BookCard {...defaultProps} />);

    const image = screen.getByTestId("book-image");
    expect(image).toHaveAttribute("src", "http://localhost:1337/test-book.jpg");
    expect(image).toHaveAttribute("alt", "Test Book");
    expect(image).toHaveAttribute("data-fill", "true");
    expect(image).toHaveAttribute("data-priority", "true");
  });

  it("should format currency correctly", () => {
    const { formatUSD } = require("@/utils/currency");
    render(<BookCard {...defaultProps} />);

    expect(formatUSD).toHaveBeenCalledWith(19.99);
  });

  it("should show AddToCart for non-admin users", () => {
    render(<BookCard {...defaultProps} />);

    expect(screen.getByTestId("add-to-cart")).toBeInTheDocument();
    expect(screen.queryByTestId("edit-book-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-book-modal")).not.toBeInTheDocument();
  });

  it("should show admin controls for admin users", () => {
    render(<BookCard {...defaultProps} isAdmin={true} />);

    expect(screen.getByTestId("edit-book-modal")).toBeInTheDocument();
    expect(screen.getByTestId("delete-book-modal")).toBeInTheDocument();
    expect(screen.queryByTestId("add-to-cart")).not.toBeInTheDocument();
  });

  it("should handle edit book action", () => {
    render(<BookCard {...defaultProps} isAdmin={true} />);

    const editButton = screen.getByTestId("edit-book-modal");
    fireEvent.click(editButton);

    expect(mockFormAction).toHaveBeenCalledWith(expect.any(FormData));
  });

  it("should handle delete book action", () => {
    render(<BookCard {...defaultProps} isAdmin={true} />);

    const deleteButton = screen.getByTestId("delete-book-modal");
    fireEvent.click(deleteButton);

    expect(mockFormActionDelete).toHaveBeenCalledWith(expect.any(FormData));
  });

  it("should disable edit button when pending", () => {
    render(<BookCard {...defaultProps} isAdmin={true} isPendingUpdateBook={true} />);

    const editButton = screen.getByTestId("edit-book-modal");
    expect(editButton).toBeDisabled();
  });

  it("should disable delete button when pending", () => {
    render(<BookCard {...defaultProps} isAdmin={true} isPendingDelete={true} />);

    const deleteButton = screen.getByTestId("delete-book-modal");
    expect(deleteButton).toBeDisabled();
  });

  it("should have correct CSS classes", () => {
    render(<BookCard {...defaultProps} />);

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("shadow-none", "rounded-none", "h-full", "flex", "flex-col");

    const cardFooter = screen.getByTestId("card-footer");
    expect(cardFooter).toHaveClass(
      "flex",
      "flex-col",
      "gap-5",
      "text-left",
      "items-start",
      "py-5",
      "px-0",
      "flex-grow"
    );
  });

  it("should handle long book title", () => {
    const bookWithLongTitle = {
      ...mockBook,
      title: "This is a very long book title that should still be displayed properly",
    };

    render(<BookCard {...defaultProps} book={bookWithLongTitle} />);

    expect(
      screen.getByText("This is a very long book title that should still be displayed properly")
    ).toBeInTheDocument();
  });

  it("should handle long book description", () => {
    const bookWithLongDescription = {
      ...mockBook,
      description:
        "This is a very long book description that provides detailed information about the book content and should be displayed properly in the card.",
    };

    render(<BookCard {...defaultProps} book={bookWithLongDescription} />);

    expect(screen.getByText(/This is a very long book description/)).toBeInTheDocument();
  });

  it("should handle missing image URL", () => {
    const bookWithoutImage = {
      ...mockBook,
      imageUrl: "",
    };

    render(<BookCard {...defaultProps} book={bookWithoutImage} />);

    const image = screen.getByTestId("book-image");
    expect(image).toHaveAttribute("src", "http://localhost:1337");
  });

  it("should handle different price formats", () => {
    const { formatUSD } = require("@/utils/currency");
    const bookWithDifferentPrice = {
      ...mockBook,
      price: 123.45,
    };

    render(<BookCard {...defaultProps} book={bookWithDifferentPrice} />);

    expect(formatUSD).toHaveBeenCalledWith(123.45);
    expect(screen.getByText("$123.45")).toBeInTheDocument();
  });

  it("should handle special characters in title and description", () => {
    const bookWithSpecialChars = {
      ...mockBook,
      title: "Book with Special Chars: @#$%",
      description: "Description with special chars: <>&\"'",
    };

    render(<BookCard {...defaultProps} book={bookWithSpecialChars} />);

    expect(screen.getByText("Book with Special Chars: @#$%")).toBeInTheDocument();
    expect(screen.getByText("Description with special chars: <>&\"'")).toBeInTheDocument();
  });

  it("should pass correct props to AddToCart", () => {
    render(<BookCard {...defaultProps} />);

    const addToCartButton = screen.getByTestId("add-to-cart");
    expect(addToCartButton).toHaveAttribute("data-variant", "order");
  });

  it("should handle result prop in admin mode", () => {
    const mockResult = { success: true as const, message: "Updated successfully" };

    render(<BookCard {...defaultProps} isAdmin={true} result={mockResult} />);

    expect(screen.getByTestId("edit-book-modal")).toBeInTheDocument();
  });

  it("should maintain proper image aspect ratio", () => {
    const { container } = render(<BookCard {...defaultProps} />);

    const imageContainer = container.querySelector(".w-full.h-\\[450px\\]");
    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer).toHaveClass("relative", "overflow-hidden", "bg-background");
  });

  it("should handle environment variable for image URL", () => {
    process.env.NEXT_PUBLIC_STRAPI_URL = "https://api.example.com";

    render(<BookCard {...defaultProps} />);

    const image = screen.getByTestId("book-image");
    expect(image).toHaveAttribute("src", "https://api.example.com/test-book.jpg");
  });

  it("should handle missing environment variable", () => {
    delete process.env.NEXT_PUBLIC_STRAPI_URL;

    render(<BookCard {...defaultProps} />);

    const image = screen.getByTestId("book-image");
    expect(image).toHaveAttribute("src", "undefined/test-book.jpg");
  });
});
