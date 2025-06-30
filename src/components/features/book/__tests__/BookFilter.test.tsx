import { render, screen, fireEvent } from "@testing-library/react";
import BookFilter from "../BookFilter";
import type { Category } from "@/types";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock("@/components/ui/Input", () => ({
  Input: ({ value, onChange, onClear, ...props }: any) => (
    <div>
      <input
        value={value || ""}
        onChange={onChange}
        data-testid="search-input"
        placeholder="Search books..."
      />
      {onClear && (
        <button onClick={() => onClear()} data-testid="clear-btn">
          Clear
        </button>
      )}
    </div>
  ),
}));

jest.mock("@/components/ui/Select", () => ({
  Select: ({ children, placeholder }: any) => (
    <select data-testid="category-select">
      <option value="">{placeholder}</option>
      {children}
    </select>
  ),
  SelectItem: ({ children }: any) => <option value="test">{children}</option>,
}));

describe("BookFilter", () => {
  const mockCategories: Category[] = [
    { id: 1, documentId: "cat-1", name: "Fiction" },
    { id: 2, documentId: "cat-2", name: "Mystery" },
  ];

  const mockOnSearchChange = jest.fn();
  const mockOnCategoryChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    const { useSearchParams } = require("next/navigation");
    useSearchParams.mockReturnValue(new URLSearchParams());
  });

  it("renders search input and category select with categories", () => {
    render(
      <BookFilter
        categories={mockCategories}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("category-select")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search books...")).toBeInTheDocument();
    expect(screen.getByText("Filter by category")).toBeInTheDocument();
  });

  it("calls onSearchChange when search input changes", () => {
    render(
      <BookFilter
        categories={mockCategories}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(mockOnSearchChange).toHaveBeenCalledWith("test search");
  });

  it("shows clear button and handles clear action", () => {
    render(
      <BookFilter
        categories={mockCategories}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const clearBtn = screen.getByTestId("clear-btn");
    fireEvent.click(clearBtn);

    expect(mockOnSearchChange).toHaveBeenCalledWith("");
  });

  it("handles empty categories array", () => {
    render(
      <BookFilter
        categories={[]}
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByTestId("category-select")).toBeInTheDocument();
    expect(screen.getByText("Filter by category")).toBeInTheDocument();
  });
});
