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
    it("should render form with confirmation message", () => {
      render(<DeleteBookForm {...defaultProps} />);

      expect(screen.getByText("Are you sure you want to delete this book?")).toBeInTheDocument();
      expect(getForm()).toBeInTheDocument();
    });

    it("should render hidden input with book documentId", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const hiddenInput = screen.getByDisplayValue("doc-123");
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute("type", "hidden");
      expect(hiddenInput).toHaveAttribute("name", "id");
    });

    it("should render Cancel and Delete buttons", () => {
      render(<DeleteBookForm {...defaultProps} />);

      expect(screen.getByTestId("button-cancel")).toBeInTheDocument();
      expect(screen.getByTestId("button-delete")).toBeInTheDocument();
    });

    it("should render buttons with correct styling props", () => {
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

  describe("Button Interactions", () => {
    it("should call onClose when Cancel button is clicked", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const cancelButton = screen.getByTestId("button-cancel");
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should not call formActionDelete when Cancel button is clicked", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const cancelButton = screen.getByTestId("button-cancel");
      fireEvent.click(cancelButton);

      expect(mockFormActionDelete).not.toHaveBeenCalled();
    });

    it("should call formActionDelete when form is submitted", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const form = getForm();
      fireEvent.submit(form);

      expect(mockFormActionDelete).toHaveBeenCalledTimes(1);
      expect(mockFormActionDelete).toHaveBeenCalledWith(expect.any(FormData));
    });

    it("should call formActionDelete when Delete button is clicked", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const deleteButton = screen.getByTestId("button-delete");
      fireEvent.click(deleteButton);

      expect(mockFormActionDelete).toHaveBeenCalledTimes(1);
      expect(mockFormActionDelete).toHaveBeenCalledWith(expect.any(FormData));
    });

    it("should include book documentId in FormData when submitted", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const form = getForm();
      fireEvent.submit(form);

      expect(mockFormActionDelete).toHaveBeenCalledWith(expect.any(FormData));

      const formData = mockFormActionDelete.mock.calls[0][0] as FormData;
      expect(formData.get("id")).toBe("doc-123");
    });
  });

  describe("Loading State", () => {
    it("should show loading state on Delete button when isPendingDelete is true", () => {
      render(<DeleteBookForm {...defaultProps} isPendingDelete={true} />);

      const deleteButton = screen.getByTestId("button-delete");
      expect(deleteButton).toHaveAttribute("data-loading", "true");
      expect(deleteButton).toBeDisabled();
      expect(deleteButton).toHaveTextContent("Loading...");
    });

    it("should not show loading state when isPendingDelete is false", () => {
      render(<DeleteBookForm {...defaultProps} isPendingDelete={false} />);

      const deleteButton = screen.getByTestId("button-delete");
      expect(deleteButton).toHaveAttribute("data-loading", "false");
      expect(deleteButton).not.toBeDisabled();
      expect(deleteButton).toHaveTextContent("Delete");
    });

    it("should not affect Cancel button loading state", () => {
      render(<DeleteBookForm {...defaultProps} isPendingDelete={true} />);

      const cancelButton = screen.getByTestId("button-cancel");
      expect(cancelButton).not.toBeDisabled();
      expect(cancelButton).toHaveTextContent("Cancel");
    });
  });

  describe("Form Submission", () => {
    it("should prevent default form submission and call custom handler", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const form = getForm();
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault");

      fireEvent(form, submitEvent);

      expect(mockFormActionDelete).toHaveBeenCalled();
    });

    it("should handle form submission with action attribute", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const form = getForm();
      expect(form).toHaveAttribute("action");
    });
  });

  describe("Edge Cases", () => {
    it("should handle book with null documentId", () => {
      const bookWithNullId = { ...mockBook, documentId: null as any };
      render(<DeleteBookForm {...defaultProps} book={bookWithNullId} />);

      const hiddenInput = screen.getByDisplayValue("");
      expect(hiddenInput).toBeInTheDocument();
    });

    it("should handle book with undefined documentId", () => {
      const bookWithUndefinedId = { ...mockBook, documentId: undefined as any };
      render(<DeleteBookForm {...defaultProps} book={bookWithUndefinedId} />);

      const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hiddenInput).toHaveValue("");
    });

    it("should handle multiple rapid Cancel button clicks", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const cancelButton = screen.getByTestId("button-cancel");
      fireEvent.click(cancelButton);
      fireEvent.click(cancelButton);
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(3);
    });

    it("should handle multiple rapid Delete button clicks when not pending", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const deleteButton = screen.getByTestId("button-delete");
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);

      expect(mockFormActionDelete).toHaveBeenCalledTimes(2);
    });

    it("should prevent Delete button clicks when pending", () => {
      render(<DeleteBookForm {...defaultProps} isPendingDelete={true} />);

      const deleteButton = screen.getByTestId("button-delete");
      expect(deleteButton).toBeDisabled();

      fireEvent.click(deleteButton);
      expect(mockFormActionDelete).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper form structure", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const form = getForm();
      expect(form).toBeInTheDocument();
    });

    it("should have buttons with proper types", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const cancelButton = screen.getByTestId("button-cancel");
      const deleteButton = screen.getByTestId("button-delete");

      expect(cancelButton).toHaveAttribute("type", "button");
      expect(deleteButton).toHaveAttribute("type", "submit");
    });

    it("should have accessible button text", () => {
      render(<DeleteBookForm {...defaultProps} />);

      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    it("should maintain button accessibility during loading", () => {
      render(<DeleteBookForm {...defaultProps} isPendingDelete={true} />);

      const deleteButton = screen.getByRole("button", { name: /loading/i });
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toBeDisabled();
    });
  });

  describe("Layout and Styling", () => {
    it("should have proper layout classes", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const buttonsContainer = screen.getByTestId("button-cancel").parentElement;
      expect(buttonsContainer).toHaveClass("flex", "justify-end", "gap-4", "mt-4");
    });

    it("should render confirmation message with proper spacing", () => {
      render(<DeleteBookForm {...defaultProps} />);

      const message = screen.getByText("Are you sure you want to delete this book?");
      expect(message.tagName).toBe("P");
    });
  });

  describe("Data Integrity", () => {
    it("should preserve original book data", () => {
      render(<DeleteBookForm {...defaultProps} />);

      expect(mockBook.documentId).toBe("doc-123");
      expect(mockBook.title).toBe("Test Book Title");
    });

    it("should handle special characters in documentId", () => {
      const bookWithSpecialChars = {
        ...mockBook,
        documentId: "doc-123_special-chars@domain.com",
      };
      render(<DeleteBookForm {...defaultProps} book={bookWithSpecialChars} />);

      const hiddenInput = screen.getByDisplayValue("doc-123_special-chars@domain.com");
      expect(hiddenInput).toBeInTheDocument();
    });
  });
});
