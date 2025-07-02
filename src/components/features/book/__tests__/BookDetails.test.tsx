import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { BookDetails } from "../BookDetails";
import { formatUSD } from "@/utils/currency";
import { addItem } from "@/app/actions";
import type { Book } from "@/types";

const mockUseActionState = jest.fn();
const mockAddCartItem = jest.fn();
const mockAddToast = jest.fn();

jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    useActionState: (...args: any[]) => mockUseActionState(...args),
  };
});

jest.mock("@/utils/currency", () => ({
  formatUSD: jest.fn((p: number) => `$${p.toFixed(2)}`),
}));

jest.mock("@/hooks/useCart", () => ({
  useCart: () => ({ addCartItem: mockAddCartItem }),
}));

jest.mock("@/app/actions", () => ({
  addItem: jest.fn(),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: ({ children, isLoading, isIconOnly, variant, fullWidth, className, ...rest }: any) => (
    <button className={className} disabled={isLoading} {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/Input", () => ({
  Input: ({ value, onChange, classNames, disableAnimation, ...rest }: any) => (
    <input value={value} onChange={onChange} {...rest} />
  ),
}));

jest.mock("@heroui/react", () => ({
  addToast: (...args: any[]) => mockAddToast(...args),
}));

jest.mock("@/components/ui/ImageWithFallback", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

jest.mock("next/navigation", () => {
  const pushMock = jest.fn();
  const useRouterMock = jest.fn().mockReturnValue({ push: pushMock });
  return { useRouter: useRouterMock, __pushMock: pushMock, __useRouterMock: useRouterMock };
});

const mockBook = {
  id: "1",
  title: "Test Book",
  price: 10,
  description: "Description",
  imageUrl: "/img.jpg",
  categories: [],
  language: "en",
  slug: "test-book",
  documentId: "doc-1",
  createdAt: "",
  updatedAt: "",
  publishedAt: "",
} as any;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseActionState.mockReturnValue([{ success: null, message: "" }, jest.fn(), false]);
});

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("BookDetails", () => {
  it("renders title, price and description", () => {
    render(<BookDetails book={mockBook} />);

    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(formatUSD).toHaveBeenCalledWith(10);
    expect(screen.getByText("$10.00 USD")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders quantity controls with initial value 1", () => {
    render(<BookDetails book={mockBook} />);
    expect(screen.getByLabelText("Book quantity")).toHaveValue("1");
  });

  it("calls addCartItem on form submit", () => {
    render(<BookDetails book={mockBook} />);
    const form = document.querySelector("form")!;
    fireEvent.submit(form);
    expect(mockAddCartItem).toHaveBeenCalledWith(mockBook, 1);
  });

  it("increments and decrements quantity via buttons", () => {
    render(<BookDetails book={mockBook} />);

    const quantityInput = screen.getByLabelText("Book quantity") as HTMLInputElement;
    const plusButton = screen.getByLabelText("Increase quantity");
    const minusButton = screen.getByLabelText("Decrease quantity");

    expect(quantityInput.value).toBe("1");
    fireEvent.click(plusButton);
    expect(quantityInput.value).toBe("2");
    expect(minusButton).not.toBeDisabled();

    fireEvent.click(minusButton);
    expect(quantityInput.value).toBe("1");
    expect(minusButton).toBeDisabled();
  });

  it("updates quantity via direct input", () => {
    render(<BookDetails book={mockBook} />);
    const quantityInput = screen.getByLabelText("Book quantity") as HTMLInputElement;

    fireEvent.change(quantityInput, { target: { value: "3" } });
    expect(quantityInput.value).toBe("3");
  });

  it("shows success toast when addItem succeeds", () => {
    mockUseActionState.mockReturnValue([{ success: true, message: "Added" }, jest.fn(), false]);
    render(<BookDetails book={mockBook} />);

    expect(mockAddToast).toHaveBeenCalledWith({ title: "Added", color: "success" });
  });

  it("shows danger toast on failure", () => {
    mockUseActionState.mockReturnValue([{ success: false, message: "Fail" }, jest.fn(), false]);
    render(<BookDetails book={mockBook} />);
    expect(mockAddToast).toHaveBeenCalledWith({
      title: "Failed to add item to cart",
      color: "danger",
    });
  });

  it("redirects to login on UNAUTHORIZED", () => {
    const { __useRouterMock, __pushMock } = require("next/navigation");
    mockUseActionState.mockReturnValue([
      { success: null, message: "UNAUTHORIZED" },
      jest.fn(),
      false,
    ]);
    __useRouterMock.mockReturnValue({ push: __pushMock });

    render(<BookDetails book={mockBook} />);

    expect(mockAddToast).toHaveBeenCalledWith({
      title: "You must be logged in to add items to your cart",
      color: "danger",
    });
    expect(__pushMock).toHaveBeenCalledWith("/login");
  });
});
