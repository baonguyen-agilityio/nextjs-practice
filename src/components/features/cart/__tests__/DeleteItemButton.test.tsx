import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DeleteItemButton } from "../DeleteItemButton";
import { removeItem } from "@/app/actions";

const mockUseActionState = jest.fn();
const mockOptimisticUpdate = jest.fn();

jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    useActionState: (...args: any[]) => mockUseActionState(...args),
  };
});

jest.mock("@/app/actions", () => ({
  removeItem: jest.fn(),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

const mockCartItem = {
  id: "cart-item-id",
  documentId: "doc-id",
  quantity: 1,
  book: {
    id: "book-id",
  },
} as any;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseActionState.mockReturnValue([{ success: null, message: "" }, jest.fn(), false]);
});

describe("DeleteItemButton", () => {
  it("renders the delete button", () => {
    render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
  });

  it("initialises useActionState correctly", () => {
    render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

    expect(mockUseActionState).toHaveBeenCalledWith(removeItem, {
      success: null,
      message: "",
    });
  });

  it("calls optimisticUpdate on form submit", () => {
    render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

    const form = document.querySelector("form")!;
    fireEvent.submit(form);

    expect(mockOptimisticUpdate).toHaveBeenCalledWith("book-id", "delete");
  });
});
