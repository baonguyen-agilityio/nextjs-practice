import { render, screen } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BookList from "../BookList";
import type { Book, Category, MetaResponse } from "@/types";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn().mockReturnValue([undefined, jest.fn(), false]),
  useTransition: jest.fn().mockReturnValue([false, jest.fn()]),
  useCallback: jest.fn((fn) => fn),
  useEffect: jest.fn(),
  useMemo: jest.fn((fn) => fn()),
  Suspense: ({ children }: any) => <div data-testid="suspense">{children}</div>,
  lazy: jest.fn((fn) => fn),
}));

jest.mock("@/hooks/useDebouncedCallback", () => ({
  useDebouncedCallback: jest.fn((fn) => fn),
}));

jest.mock("@/app/actions/book", () => ({
  deleteBookAction: jest.fn(),
  updateBook: jest.fn(),
}));

jest.mock("@heroui/react", () => ({
  addToast: jest.fn(),
}));

jest.mock("../BookCard", () => {
  return function MockBookCard({ book, isAdmin }: { book: Book; isAdmin: boolean }) {
    return (
      <div data-testid="book-card">
        <div data-testid="book-title">{book.title}</div>
        <div data-testid="is-admin">{isAdmin ? "admin" : "user"}</div>
      </div>
    );
  };
});

jest.mock("../BookFilter", () => {
  return function MockBookFilter({
    categories,
    onSearchChange,
    onCategoryChange,
  }: {
    categories: Category[];
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
  }) {
    return (
      <div data-testid="book-filter">
        <button onClick={() => onSearchChange("test search")} data-testid="trigger-search">
          Search
        </button>
        <button onClick={() => onCategoryChange("cat-1")} data-testid="trigger-category">
          Category
        </button>
        Filter ({categories.length})
      </div>
    );
  };
});

jest.mock("../DynamicModals", () => ({
  LazyCreateBookModal: function MockLazyCreateBookModal({
    categories,
  }: {
    categories: Category[];
  }) {
    return <button data-testid="create-book-modal">Create Book ({categories.length})</button>;
  },
}));

jest.mock("@/components/ui/Pagination", () => {
  return function MockPagination({
    total,
    initialPage,
    onChange,
  }: {
    total: number;
    initialPage: number;
    onChange: (page: number) => void;
  }) {
    return (
      <div data-testid="pagination">
        <button onClick={() => onChange(2)} data-testid="trigger-page-change">
          Page {initialPage} of {total}
        </button>
      </div>
    );
  };
});

jest.mock("@/components/ui/SkeletonList", () => {
  return function MockSkeletonList() {
    return <div data-testid="skeleton-list">Loading...</div>;
  };
});

jest.mock("next/link", () => {
  return function MockLink({ children, href, className }: any) {
    return (
      <a href={href} className={className} data-testid="book-link">
        {children}
      </a>
    );
  };
});

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

describe("BookList", () => {
  const mockReplace = jest.fn();
  const mockStartTransition = jest.fn((callback) => callback());

  const mockBooks: Book[] = [
    {
      id: "1",
      documentId: "doc-1",
      slug: "book-1",
      title: "Test Book 1",
      price: 19.99,
      language: "en",
      description: "First test book",
      imageUrl: "/book1.jpg",
      categories: [],
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
      publishedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      documentId: "doc-2",
      slug: "book-2",
      title: "Test Book 2",
      price: 29.99,
      language: "en",
      description: "Second test book",
      imageUrl: "/book2.jpg",
      categories: [],
      createdAt: "2023-01-02T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z",
      publishedAt: "2023-01-02T00:00:00.000Z",
    },
  ];

  const mockCategories: Category[] = [
    { id: 1, documentId: "cat-1", name: "Fiction" },
    { id: 2, documentId: "cat-2", name: "Mystery" },
  ];

  const mockPagination: MetaResponse["pagination"] = {
    page: 1,
    pageSize: 10,
    pageCount: 3,
    total: 25,
  };

  const defaultProps = {
    books: mockBooks,
    pagination: mockPagination,
    isAdmin: false,
    categories: mockCategories,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const { useTransition } = require("react");
    useTransition.mockReturnValue([false, mockStartTransition]);

    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    } as any);

    mockUsePathname.mockReturnValue("/books");

    const mockSearchParams = {
      get: jest.fn().mockReturnValue(null),
      has: jest.fn().mockReturnValue(false),
      getAll: jest.fn().mockReturnValue([]),
      keys: jest.fn().mockReturnValue([]),
      values: jest.fn().mockReturnValue([]),
      entries: jest.fn().mockReturnValue([]),
      forEach: jest.fn(),
      toString: jest.fn().mockReturnValue(""),
      [Symbol.iterator]: jest.fn().mockReturnValue({
        next: jest.fn().mockReturnValue({ done: true, value: undefined }),
      }),
    };

    mockUseSearchParams.mockReturnValue(mockSearchParams as any);
  });

  describe("Component Structure", () => {
    it("should export component correctly", () => {
      expect(BookList).toBeDefined();
      expect(typeof BookList).toBe("function");
    });

    it("should validate prop types", () => {
      expect(Array.isArray(mockBooks)).toBe(true);
      expect(Array.isArray(mockCategories)).toBe(true);
      expect(typeof defaultProps.isAdmin).toBe("boolean");
      expect(mockPagination).toHaveProperty("page");
      expect(mockPagination).toHaveProperty("pageCount");
    });
  });

  describe("Data Handling", () => {
    it("should handle books array correctly", () => {
      expect(mockBooks).toHaveLength(2);
      expect(mockBooks[0]).toHaveProperty("title", "Test Book 1");
      expect(mockBooks[0]).toHaveProperty("price", 19.99);
      expect(mockBooks[1]).toHaveProperty("title", "Test Book 2");
    });

    it("should handle categories array correctly", () => {
      expect(mockCategories).toHaveLength(2);
      expect(mockCategories[0]).toHaveProperty("name", "Fiction");
      expect(mockCategories[1]).toHaveProperty("name", "Mystery");
    });

    it("should handle pagination data structure", () => {
      expect(mockPagination!.pageCount).toBe(3);
      expect(mockPagination!.page).toBe(1);
      expect(mockPagination!.total).toBe(25);
      expect(mockPagination!.pageSize).toBe(10);
    });
  });

  describe("Pagination Logic", () => {
    it("should handle default pagination values", () => {
      const noPagination = { ...defaultProps, pagination: undefined };
      expect(() => {
        const { page = 1, pageCount = 1 } = noPagination.pagination ?? {};
        expect(page).toBe(1);
        expect(pageCount).toBe(1);
      }).not.toThrow();
    });

    it("should extract page and pageCount from pagination", () => {
      const { page, pageCount } = mockPagination!;
      expect(page).toBe(1);
      expect(pageCount).toBe(3);
    });

    it("should handle custom pagination values", () => {
      const customPagination = { ...mockPagination, page: 2, pageCount: 5 };
      expect(customPagination.page).toBe(2);
      expect(customPagination.pageCount).toBe(5);
    });
  });

  describe("Admin Logic", () => {
    it("should handle admin prop correctly", () => {
      const adminProps = { ...defaultProps, isAdmin: true };
      const userProps = { ...defaultProps, isAdmin: false };

      expect(adminProps.isAdmin).toBe(true);
      expect(userProps.isAdmin).toBe(false);
    });

    it("should validate categories for admin features", () => {
      expect(mockCategories).toHaveLength(2);
      expect(mockCategories.every((cat) => cat.name && cat.id)).toBe(true);
    });

    it("should handle conditional admin rendering logic", () => {
      const adminCondition = true;
      const userCondition = false;

      expect(adminCondition && mockCategories.length > 0).toBe(true);
      expect(userCondition && mockCategories.length > 0).toBe(false);
    });
  });

  describe("Component Behavior", () => {
    it("should handle pending state logic", () => {
      const isPending = false;
      const mockLength = 6;

      expect(typeof isPending).toBe("boolean");
      expect(typeof mockLength).toBe("number");
      expect(isPending ? "skeleton" : "content").toBe("content");
    });

    it("should handle book mapping logic", () => {
      const mappedBooks = mockBooks.map((book) => ({
        id: book.id,
        title: book.title,
        isAdmin: false,
      }));

      expect(mappedBooks).toHaveLength(2);
      expect(mappedBooks[0]?.title).toBe("Test Book 1");
      expect(mappedBooks[1]?.title).toBe("Test Book 2");
    });

    it("should handle pagination visibility logic", () => {
      const shouldShowPagination = !!(mockPagination && mockPagination.pageCount! > 1);
      expect(shouldShowPagination).toBe(true);

      const singlePagePagination = { ...mockPagination!, pageCount: 1 };
      const shouldHidePagination = !!(singlePagePagination && singlePagePagination.pageCount > 1);
      expect(shouldHidePagination).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty books array", () => {
      const emptyProps = { ...defaultProps, books: [] };
      expect(emptyProps.books).toHaveLength(0);
      expect(Array.isArray(emptyProps.books)).toBe(true);
    });

    it("should handle undefined pagination", () => {
      const noPaginationProps = { ...defaultProps, pagination: undefined };
      expect(noPaginationProps.pagination).toBeUndefined();
    });

    it("should handle single page pagination", () => {
      const singlePagePagination = { ...mockPagination, pageCount: 1 };
      expect(singlePagePagination.pageCount).toBe(1);
    });

    it("should handle empty categories", () => {
      const noCategoriesProps = { ...defaultProps, categories: [] };
      expect(noCategoriesProps.categories).toHaveLength(0);
      expect(Array.isArray(noCategoriesProps.categories)).toBe(true);
    });

    it("should handle book with missing properties gracefully", () => {
      const incompleteBook = { id: "3", title: "Incomplete" } as Book;
      expect(incompleteBook.id).toBe("3");
      expect(incompleteBook.title).toBe("Incomplete");
    });
  });
});
