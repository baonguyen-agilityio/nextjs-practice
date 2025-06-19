import { render, screen, fireEvent } from "@testing-library/react";
import DeleteBookForm from "../DeleteBookForm";
import type { Book } from "@/types";

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onPress, color, variant, type, isLoading }: any) {
    return (
      <button
        onClick={onPress}
        data-testid={`button-${children.toLowerCase()}`}
        data-color={color}
        data-variant={variant}
        type={type}
        disabled={isLoading}
        data-loading={isLoading}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
}));

const getForm = () => document.querySelector("form") as HTMLFormElement;

describe("DeleteBookForm", () => {
  const mockBook: Book = {
    id: "1",
    documentId: "doc-123",
    slug: "test-book",
    title: "Test Book Title",
    price: 19.99,
    language: "en",
    description: "A test book description",
    imageUrl: "/test-book.jpg",
    categories: [],
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
  };

  const mockOnClose = jest.fn();
  const mockFormActionDelete = jest.fn();

  const defaultProps = {
    book: mockBook,
    onClose: mockOnClose,
    formActionDelete: mockFormActionDelete,
    isPendingDelete: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render form with confirmation message and buttons", () => {
      render(<DeleteBookForm {...defaultProps} />);

      expect(screen.getByText("Are you sure you want to delete this book?")).toBeInTheDocument();
      expect(getForm()).toBeInTheDocument();
      expect(screen.getByTestId("button-cancel")).toBeInTheDocument();
      expect(screen.getByTestId("button-delete")).toBeInTheDocument();
    });

    it("should render hidden input with book documentId", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const hiddenInput = screen.getByDisplayValue("doc-123");
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute("type", "hidden");
      expect(hiddenInput).toHaveAttribute("name", "id");
    });

    it("should render buttons with correct props", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const cancelButton = screen.getByTestId("button-cancel");
      const deleteButton = screen.getByTestId("button-delete");

      expect(cancelButton).toHaveAttribute("data-color", "danger");
      expect(cancelButton).toHaveAttribute("data-variant", "flat");
      expect(cancelButton).toHaveAttribute("type", "button");

      expect(deleteButton).toHaveAttribute("data-color", "danger");
      expect(deleteButton).toHaveAttribute("data-variant", "flat");
      expect(deleteButton).toHaveAttribute("type", "submit");
    });
  });

  describe("User Interactions", () => {
    it("should call onClose when Cancel button is clicked", () => {
      render(<DeleteBookForm {...defaultProps} />);

      fireEvent.click(screen.getByTestId("button-cancel"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockFormActionDelete).not.toHaveBeenCalled();
    });

    it("should call formActionDelete when form is submitted", () => {
      render(<DeleteBookForm {...defaultProps} />);

      fireEvent.submit(getForm());
      expect(mockFormActionDelete).toHaveBeenCalledTimes(1);
      expect(mockFormActionDelete).toHaveBeenCalledWith(expect.any(FormData));

      const formData = mockFormActionDelete.mock.calls[0][0] as FormData;
      expect(formData.get("id")).toBe("doc-123");
    });

    it("should call formActionDelete when Delete button is clicked", () => {
      render(<DeleteBookForm {...defaultProps} />);

      fireEvent.click(screen.getByTestId("button-delete"));
      expect(mockFormActionDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe("Loading State", () => {
    it("should show loading state on Delete button when pending", () => {
      render(<DeleteBookForm {...defaultProps} isPendingDelete={true} />);

      const deleteButton = screen.getByTestId("button-delete");
      expect(deleteButton).toHaveAttribute("data-loading", "true");
      expect(deleteButton).toBeDisabled();
      expect(deleteButton).toHaveTextContent("Loading...");
    });

    it("should not show loading state when not pending", () => {
      render(<DeleteBookForm {...defaultProps} isPendingDelete={false} />);

      const deleteButton = screen.getByTestId("button-delete");
      expect(deleteButton).toHaveAttribute("data-loading", "false");
      expect(deleteButton).not.toBeDisabled();
      expect(deleteButton).toHaveTextContent("Delete");
    });

    it("should not affect Cancel button during loading", () => {
      render(<DeleteBookForm {...defaultProps} isPendingDelete={true} />);

      const cancelButton = screen.getByTestId("button-cancel");
      expect(cancelButton).not.toBeDisabled();
      expect(cancelButton).toHaveTextContent("Cancel");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty documentId", () => {
      const bookWithEmptyId = { ...mockBook, documentId: "" };
      render(<DeleteBookForm {...defaultProps} book={bookWithEmptyId} />);

      const hiddenInput = screen.getByDisplayValue("");
      expect(hiddenInput).toBeInTheDocument();
    });

    it("should prevent Delete button when pending", () => {
      render(<DeleteBookForm {...defaultProps} isPendingDelete={true} />);

      const deleteButton = screen.getByTestId("button-delete");
      expect(deleteButton).toBeDisabled();

      fireEvent.click(deleteButton);
      expect(mockFormActionDelete).not.toHaveBeenCalled();
    });
  });
});
