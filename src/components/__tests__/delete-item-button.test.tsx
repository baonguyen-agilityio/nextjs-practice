import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DeleteItemButton } from "../features/cart/DeleteItemButton";
import type { CartItem } from "@/types";

// Mock the app actions
jest.mock("@/app/actions", () => ({
  removeItem: jest.fn(),
}));

// Mock the Button component
jest.mock("@/components/ui/Button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

const mockCartItem: CartItem = {
  id: "1",
  quantity: 2,
  documentId: "doc-1",
  totalAmount: 29.98,
  book: {
    id: "book-1",
    title: "Test Book",
    price: 14.99,
    imageUrl: "/test-image.jpg",
    description: "A test book",
    slug: "test-book",
    language: "en",
    categories: [
      {
        id: 1,
        name: "Fiction",
        documentId: "cat-doc-1",
      },
    ],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    publishedAt: "2024-01-01T00:00:00.000Z",
    documentId: "book-doc-1",
  },
};

describe("DeleteItemButton", () => {
  const mockOptimisticUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the remove button", () => {
    render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

    const statusElement = screen.getByRole("status");
    expect(statusElement).toHaveAttribute("aria-live", "polite");
    expect(statusElement).toHaveClass("sr-only");
  });

  it("calls optimisticUpdate when form is submitted", async () => {
    render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

    const button = screen.getByRole("button", { name: "Remove" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOptimisticUpdate).toHaveBeenCalledWith("book-1", "delete");
    });
  });

  it("handles missing documentId gracefully", () => {
    const itemWithoutDocId = { ...mockCartItem, documentId: undefined };

    render(<DeleteItemButton item={itemWithoutDocId} optimisticUpdate={mockOptimisticUpdate} />);

    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("has correct form structure", () => {
    render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

    const form = screen.getByRole("button").closest("form");
    expect(form).toBeInTheDocument();
  });

  it("button has correct attributes", () => {
    render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

    const button = screen.getByRole("button", { name: "Remove" });
    expect(button).toHaveAttribute("type", "submit");
  });
});
