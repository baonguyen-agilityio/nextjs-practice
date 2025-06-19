import { render, screen, fireEvent } from "@testing-library/react";
import BookFilter from "../BookFilter";
import type { Category } from "@/types";

const mockReplace = jest.fn();
const mockStartTransition = jest.fn((callback) => callback());

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/books"),
  useRouter: jest.fn(() => ({
    replace: mockReplace,
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useTransition: jest.fn(() => [false, mockStartTransition]),
}));

jest.mock("@/components/ui/Input", () => ({
  Input: ({ type, placeholder, value, onChange, ...props }: any) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-testid="search-input"
      {...props}
    />
  ),
}));

jest.mock("@heroui/react", () => ({
  Select: ({ children, placeholder, selectedKeys, onSelectionChange }: any) => {
    const handleChange = (e: any) => {
      const value = e.target.value;
      onSelectionChange?.(value ? new Set([value]) : new Set());
    };

    return (
      <select
        value={selectedKeys && selectedKeys.size > 0 ? [...selectedKeys][0] : ""}
        onChange={handleChange}
        data-testid="category-select"
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    );
  },
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
}));

describe("BookFilter", () => {
  const mockCategories: Category[] = [
    { id: 1, documentId: "cat-1", name: "Fiction" },
    { id: 2, documentId: "cat-2", name: "Mystery" },
  ];

  const mockOnSearchChange = jest.fn();
  const mockOnCategoryChange = jest.fn();

  const defaultProps = {
    categories: mockCategories,
    onSearchChange: mockOnSearchChange,
    onCategoryChange: mockOnCategoryChange,
  };

  const { useSearchParams } = require("next/navigation");

  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParams.mockReturnValue(new URLSearchParams());
  });

  describe("Component Rendering", () => {
    it("should render search input and category select", () => {
      render(<BookFilter {...defaultProps} />);

      expect(screen.getByTestId("search-input")).toBeInTheDocument();
      expect(screen.getByTestId("category-select")).toBeInTheDocument();
    });

    it("should render category options", () => {
      render(<BookFilter {...defaultProps} />);

      expect(screen.getByText("Fiction")).toBeInTheDocument();
      expect(screen.getByText("Mystery")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should handle search input change", () => {
      render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "test search" } });

      expect(mockOnSearchChange).toHaveBeenCalledWith("test search");
    });

    it("should handle category selection", () => {
      render(<BookFilter {...defaultProps} />);

      const categorySelect = screen.getByTestId("category-select");
      fireEvent.change(categorySelect, { target: { value: "cat-1" } });

      expect(categorySelect).toBeInTheDocument();
    });
  });

  describe("URL Parameters", () => {
    it("should populate fields from search params", () => {
      const searchParams = new URLSearchParams("?search=test&categories=cat-1");
      useSearchParams.mockReturnValue(searchParams);

      render(<BookFilter {...defaultProps} />);

      const searchInput = screen.getByTestId("search-input");
      expect(searchInput).toHaveValue("test");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty categories array", () => {
      render(<BookFilter {...defaultProps} categories={[]} />);

      expect(screen.getByTestId("category-select")).toBeInTheDocument();
      expect(screen.getByText("Filter by category")).toBeInTheDocument();
    });
  });
});
