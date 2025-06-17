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

jest.mock("@/components/features/book/BookCard", () => ({
  __esModule: true,
  default: ({ book }: { book: Book }) => (
    <div data-testid={`book-card-${book.id}`} data-book-title={book.title}>
      <h3 data-testid={`book-title-${book.id}`}>{book.title}</h3>
      <p data-testid={`book-price-${book.id}`}>${book.price}</p>
    </div>
  ),
}));

jest.mock("@/components/features/book/BookFilter", () => ({
  __esModule: true,
  default: () => <div data-testid="book-filter">Filter Component</div>,
}));

jest.mock("@/components/ui/SkeletonList", () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton-list">Loading...</div>,
}));

jest.mock("@/components/ui/Pagination", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="pagination">
      Pagination - Total: {props.total || props.pageCount || "unknown"}
    </div>
  ),
}));

jest.mock("@/components/features/book/CreateBookModal", () => ({
  __esModule: true,
  default: () => <div data-testid="create-book-modal">Create Book Modal</div>,
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

describe("BookList", () => {
  const mockReplace = jest.fn();

  const mockBooks: Book[] = [
    {
      id: "1",
      documentId: "book-1",
      title: "JavaScript Guide",
      price: 2999,
      description: "Learn JavaScript",
      language: "English",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      publishedAt: "2024-01-01",
      slug: "javascript-guide",
      imageUrl: "http://example.com/js-guide.jpg",
      categories: [],
    },
    {
      id: "2",
      documentId: "book-2",
      title: "React Handbook",
      price: 3999,
      description: "Master React",
      language: "English",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      publishedAt: "2024-01-01",
      slug: "react-handbook",
      imageUrl: "http://example.com/react-handbook.jpg",
      categories: [],
    },
  ];

  const mockCategories: Category[] = [
    { id: 1, name: "Fiction", documentId: "cat-1" },
    { id: 2, name: "Non-Fiction", documentId: "cat-2" },
  ];

  const mockPagination: MetaResponse["pagination"] = {
    page: 1,
    pageSize: 10,
    pageCount: 2,
    total: 15,
  };

  beforeEach(() => {
    jest.clearAllMocks();

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

  it("should handle missing pagination", () => {
    render(
      <BookList
        books={mockBooks}
        pagination={undefined}
        isAdmin={false}
        categories={mockCategories}
      />
    );

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("should not render create book modal when not admin", () => {
    render(
      <BookList
        books={mockBooks}
        pagination={mockPagination}
        isAdmin={false}
        categories={mockCategories}
      />
    );

    expect(screen.queryByTestId("create-book-modal")).not.toBeInTheDocument();
  });

  it("should render pagination when provided", () => {
    render(
      <BookList
        books={mockBooks}
        pagination={mockPagination}
        isAdmin={false}
        categories={mockCategories}
      />
    );

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    expect(screen.getByText("Pagination - Total: 2")).toBeInTheDocument();
  });

  it("should handle empty books array", () => {
    render(
      <BookList
        books={[]}
        pagination={mockPagination}
        isAdmin={false}
        categories={mockCategories}
      />
    );

    expect(screen.queryByTestId(/book-card-/)).not.toBeInTheDocument();

    expect(screen.getByTestId("book-filter")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });
});
