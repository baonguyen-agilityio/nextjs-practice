import { render, screen } from "@testing-library/react";
import {
  DynamicEditBookModal,
  DynamicDeleteBookModal,
  DynamicCreateBookModal,
  LazyEditBookModal,
  LazyDeleteBookModal,
  LazyCreateBookModal,
} from "../DynamicModals";
import type { Book, Category } from "@/types";

jest.mock("@heroui/react", () => ({
  Skeleton: function MockSkeleton({ children, className }: any) {
    return (
      <div data-testid="skeleton" className={className}>
        {children}
      </div>
    );
  },
}));

describe("DynamicModals", () => {
  const mockBook: Book = {
    id: "1",
    documentId: "doc-123",
    slug: "test-book",
    title: "Test Book",
    price: 19.99,
    language: "en",
    description: "Test description",
    imageUrl: "/test.jpg",
    categories: [],
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
  };

  const mockCategories: Category[] = [{ id: 1, documentId: "cat-1", name: "Fiction" }];

  describe("Dynamic Components", () => {
    it("should render DynamicEditBookModal with loading state", () => {
      render(
        <DynamicEditBookModal
          book={mockBook}
          categories={mockCategories}
          formAction={jest.fn()}
          isPending={false}
          result={undefined}
        />
      );

      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("should render DynamicDeleteBookModal with loading state", () => {
      render(
        <DynamicDeleteBookModal
          book={mockBook}
          formActionDelete={jest.fn()}
          isPendingDelete={false}
        />
      );

      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("should render DynamicCreateBookModal with loading state", () => {
      render(<DynamicCreateBookModal categories={mockCategories} />);

      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });
  });

  describe("Lazy Components", () => {
    it("should render LazyEditBookModal with Suspense fallback", () => {
      render(
        <LazyEditBookModal
          book={mockBook}
          categories={mockCategories}
          formAction={jest.fn()}
          isPending={false}
          result={undefined}
        />
      );

      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("should render LazyDeleteBookModal with Suspense fallback", () => {
      render(
        <LazyDeleteBookModal book={mockBook} formActionDelete={jest.fn()} isPendingDelete={false} />
      );

      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("should render LazyCreateBookModal with Suspense fallback", () => {
      render(<LazyCreateBookModal categories={mockCategories} />);

      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });
  });
});
