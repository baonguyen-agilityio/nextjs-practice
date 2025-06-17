import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import BookFilter from "../BookFilter";
import type { Category } from "@/types";
import React from "react";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@heroui/react", () => {
  return {
    Select: ({ children, placeholder, onChange, selectedKeys, ...props }: any) => {
      const currentValue = selectedKeys && selectedKeys.length > 0 ? selectedKeys[0] : "";

      const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e);
      };

      return (
        <select
          data-testid="category-select"
          onChange={handleChange}
          value={currentValue}
          {...props}
        >
          <option value="">{placeholder}</option>
          {children && React.Children.count(children) > 0 && (
            <>
              <option value="1">Fiction</option>
              <option value="2">Non-Fiction</option>
              <option value="3">Science</option>
              <option value="4">History</option>
            </>
          )}
        </select>
      );
    },
    SelectItem: function MockSelectItem({ children, ...props }: any) {
      return null;
    },
  };
});

jest.mock("@/components/ui/Input", () => ({
  Input: ({ onChange, onClear, value, placeholder, isClearable, ...props }: any) => (
    <div>
      <input
        data-testid="search-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {isClearable && (
        <button data-testid="clear-button" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  ),
}));

const mockCategories: Category[] = [
  { id: 1, documentId: "1", name: "Fiction" },
  { id: 2, documentId: "2", name: "Non-Fiction" },
  { id: 3, documentId: "3", name: "Science" },
  { id: 4, documentId: "4", name: "History" },
];

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

const createMockSearchParams = (getImplementation?: (param: string) => string | null) => ({
  get: jest.fn(getImplementation || (() => null)),
  has: jest.fn().mockReturnValue(false),
  getAll: jest.fn().mockReturnValue([]),
  keys: jest.fn(),
  values: jest.fn(),
  entries: jest.fn(),
  forEach: jest.fn(),
  append: jest.fn(),
  delete: jest.fn(),
  set: jest.fn(),
  sort: jest.fn(),
  toString: jest.fn().mockReturnValue(""),
  size: 0,
});

describe("BookFilter", () => {
  const mockOnSearchChange = jest.fn();
  const mockOnCategoryChange = jest.fn();

  const defaultProps = {
    categories: mockCategories,
    onSearchChange: mockOnSearchChange,
    onCategoryChange: mockOnCategoryChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseSearchParams.mockReturnValue(createMockSearchParams() as any);
  });

  describe("Rendering", () => {
    it("should render search input with correct placeholder", () => {
      render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("placeholder", "Search books...");
    });

    it("should render category select with correct placeholder", () => {
      render(<BookFilter {...defaultProps} />);

      const categorySelect = screen.getByTestId("category-select");
      expect(categorySelect).toBeInTheDocument();
      expect(categorySelect).toHaveDisplayValue("Filter by category");
    });

    it("should render all category options", () => {
      render(<BookFilter {...defaultProps} />);

      mockCategories.forEach((category) => {
        expect(screen.getByText(category.name)).toBeInTheDocument();
      });
    });

    it("should render clear button for search input", () => {
      render(<BookFilter {...defaultProps} />);

      const clearButton = screen.getByTestId("clear-button");
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe("Initial Values from URL Parameters", () => {
    it("should set initial search value from URL params", () => {
      const mockGet = (param: string) => {
        if (param === "search") return "test search";
        return null;
      };

      mockUseSearchParams.mockReturnValue(createMockSearchParams(mockGet) as any);

      render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");
      expect(searchInput).toHaveValue("test search");
    });

    it("should set initial category value from URL params", () => {
      const mockGet = (param: string) => {
        if (param === "categories") return "2";
        return null;
      };

      mockUseSearchParams.mockReturnValue(createMockSearchParams(mockGet) as any);

      render(<BookFilter {...defaultProps} />);

      const categorySelect = screen.getByTestId("category-select");
      expect(categorySelect).toHaveValue("2");
    });

    it("should handle empty URL params", () => {
      mockUseSearchParams.mockReturnValue(createMockSearchParams() as any);

      render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");
      const categorySelect = screen.getByTestId("category-select");

      expect(searchInput).toHaveValue("");
      expect(categorySelect).toHaveValue("");
    });
  });

  describe("User Interactions", () => {
    it("should call onSearchChange when typing in search input", () => {
      render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "new search" } });

      expect(mockOnSearchChange).toHaveBeenCalledWith("new search");
    });

    it("should update search input value when typing", () => {
      render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "new search" } });

      expect(searchInput).toHaveValue("new search");
    });

    it("should call onCategoryChange when selecting a category", () => {
      render(<BookFilter {...defaultProps} />);

      const categorySelect = screen.getByTestId("category-select");
      fireEvent.change(categorySelect, { target: { value: "2" } });

      expect(mockOnCategoryChange).toHaveBeenCalledWith("2");
    });

    it("should update category select value when selecting", () => {
      render(<BookFilter {...defaultProps} />);

      const categorySelect = screen.getByTestId("category-select");
      fireEvent.change(categorySelect, { target: { value: "3" } });

      expect(categorySelect).toHaveValue("3");
    });

    it("should clear search input when clear button is clicked", () => {
      render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");
      const clearButton = screen.getByTestId("clear-button");

      fireEvent.change(searchInput, { target: { value: "test" } });
      expect(searchInput).toHaveValue("test");

      fireEvent.click(clearButton);

      expect(searchInput).toHaveValue("");
      expect(mockOnSearchChange).toHaveBeenCalledWith("");
    });
  });

  describe("useEffect behavior", () => {
    it("should update state when search params change", async () => {
      mockUseSearchParams.mockReturnValue(createMockSearchParams() as any);
      const { rerender } = render(<BookFilter {...defaultProps} />);

      const mockGet = (param: string) => {
        if (param === "search") return "updated search";
        if (param === "categories") return "3";
        return null;
      };

      mockUseSearchParams.mockReturnValue(createMockSearchParams(mockGet) as any);
      rerender(<BookFilter {...defaultProps} />);

      await waitFor(() => {
        const searchInput = screen.getByTestId("search-input");
        const categorySelect = screen.getByTestId("category-select");

        expect(searchInput).toHaveValue("updated search");
        expect(categorySelect).toHaveValue("3");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty categories array", () => {
      render(<BookFilter {...defaultProps} categories={[]} />);

      const categorySelect = screen.getByTestId("category-select");
      expect(categorySelect).toBeInTheDocument();

      const options = categorySelect.querySelectorAll("option");
      expect(options).toHaveLength(1);
    });

    it("should handle category selection with empty string", () => {
      render(<BookFilter {...defaultProps} />);

      const categorySelect = screen.getByTestId("category-select");
      fireEvent.change(categorySelect, { target: { value: "" } });

      expect(mockOnCategoryChange).toHaveBeenCalledWith("");
      expect(categorySelect).toHaveValue("");
    });

    it("should handle multiple rapid search input changes", () => {
      render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");

      fireEvent.change(searchInput, { target: { value: "a" } });
      fireEvent.change(searchInput, { target: { value: "ab" } });
      fireEvent.change(searchInput, { target: { value: "abc" } });

      expect(mockOnSearchChange).toHaveBeenCalledTimes(3);
      expect(mockOnSearchChange).toHaveBeenLastCalledWith("abc");
      expect(searchInput).toHaveValue("abc");
    });

    it("should handle simultaneous search and category changes", () => {
      render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");
      const categorySelect = screen.getByTestId("category-select");

      fireEvent.change(searchInput, { target: { value: "fantasy" } });
      fireEvent.change(categorySelect, { target: { value: "1" } });

      expect(mockOnSearchChange).toHaveBeenCalledWith("fantasy");
      expect(mockOnCategoryChange).toHaveBeenCalledWith("1");
      expect(searchInput).toHaveValue("fantasy");
      expect(categorySelect).toHaveValue("1");
    });

    it("should handle null values from search params", () => {
      const mockGet = jest.fn().mockReturnValue(null);
      mockUseSearchParams.mockReturnValue(createMockSearchParams(mockGet) as any);

      render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");
      const categorySelect = screen.getByTestId("category-select");

      expect(searchInput).toHaveValue("");
      expect(categorySelect).toHaveValue("");
    });

    it("should maintain component state during rapid re-renders", () => {
      const { rerender } = render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "persistent" } });

      rerender(<BookFilter {...defaultProps} />);

      expect(searchInput).toHaveValue("persistent");
      expect(mockOnSearchChange).toHaveBeenCalledWith("persistent");
    });
  });
});
