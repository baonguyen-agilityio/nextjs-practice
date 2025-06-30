import { render, screen, fireEvent } from "@testing-library/react";
import ArticleDetails from "../ArticleDetails";
import type { Article } from "@/types";

jest.mock("@/components/ui/Banner", () => ({
  Banner: function MockBanner({ title }: any) {
    return <div data-testid="banner">{title}</div>;
  },
}));

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, variant, onClick, className }: any) {
    return (
      <button onClick={onClick} data-variant={variant} className={className} data-testid="button">
        {children}
      </button>
    );
  },
}));

jest.mock("next/image", () => {
  return function MockImage({ src, alt, fill, className, sizes, priority }: any) {
    return (
      <img
        src={src}
        alt={alt}
        data-fill={fill}
        className={className}
        data-sizes={sizes}
        data-priority={priority}
        data-testid="article-image"
      />
    );
  };
});

Object.defineProperty(window, "history", {
  value: {
    back: jest.fn(),
  },
  writable: true,
});

describe("ArticleDetails", () => {
  const mockArticle: Article = {
    id: "1",
    documentId: "doc-1",
    slug: "test-article",
    title: "Test Article",
    description: "Test description",
    content: "<p>This is a test article content with <strong>HTML</strong> formatting.</p>",
    imageUrl: "/test-image.jpg",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
    author: {
      name: "John Doe",
    },
  };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_STRAPI_URL = "http://localhost:1337";
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render all main elements", () => {
      render(<ArticleDetails article={mockArticle} />);

      expect(screen.getByTestId("banner")).toBeInTheDocument();
      expect(screen.getByTestId("button")).toBeInTheDocument();
      expect(screen.getByTestId("article-image")).toBeInTheDocument();
    });

    it("should render banner with correct title", () => {
      render(<ArticleDetails article={mockArticle} />);

      const banner = screen.getByTestId("banner");
      expect(banner).toHaveTextContent("Significant reading has more info number");
    });

    it("should render back button with correct props", () => {
      render(<ArticleDetails article={mockArticle} />);

      const backButton = screen.getByTestId("button");
      expect(backButton).toHaveTextContent("← Back to list");
      expect(backButton).toHaveAttribute("data-variant", "secondaryGhost");
    });
  });

  describe("User Interactions", () => {
    it("should handle back button click", () => {
      render(<ArticleDetails article={mockArticle} />);

      const backButton = screen.getByTestId("button");
      fireEvent.click(backButton);

      expect(window.history.back).toHaveBeenCalled();
    });
  });

  describe("Image Handling", () => {
    it("should render image with correct props and environment URL", () => {
      render(<ArticleDetails article={mockArticle} />);

      const image = screen.getByTestId("article-image");
      expect(image).toHaveAttribute("src", "http://localhost:1337/test-image.jpg");
      expect(image).toHaveAttribute("alt", "Cover image of Test Article article");
      expect(image).toHaveAttribute("data-priority", "true");
      expect(image).toHaveClass("object-cover");
      expect(image).toHaveAttribute(
        "data-sizes",
        "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      );
      expect(image).toHaveAttribute("data-priority", "true");
    });

    it("should handle missing environment variable", () => {
      delete process.env.NEXT_PUBLIC_STRAPI_URL;

      render(<ArticleDetails article={mockArticle} />);

      const image = screen.getByTestId("article-image");
      expect(image).toHaveAttribute("src", "/test-image.jpg");
    });
  });

  describe("Content Display", () => {
    it("should display published date and author", () => {
      render(<ArticleDetails article={mockArticle} />);

      expect(screen.getByText("January 1, 2023 / John Doe")).toBeInTheDocument();
    });

    it("should render content with HTML", () => {
      const { container } = render(<ArticleDetails article={mockArticle} />);

      expect(container.textContent).toContain("This is a test article content");
      expect(container.textContent).toContain("HTML");
    });

    it("should handle empty content", () => {
      const articleWithEmptyContent = {
        ...mockArticle,
        content: "",
      };

      const { container } = render(<ArticleDetails article={articleWithEmptyContent} />);

      expect(container.querySelector(".space-y-4")).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("should have correct container structure", () => {
      const { container } = render(<ArticleDetails article={mockArticle} />);

      const section = container.querySelector("section");
      expect(section).toHaveClass("container", "mx-auto", "px-4", "max-w-7xl");

      const paddingDiv = container.querySelector(".py-10");
      expect(paddingDiv).toHaveClass("py-10", "md:p-16", "lg:p-20");

      const spacingDiv = container.querySelector(".space-y-4");
      expect(spacingDiv).toHaveClass("space-y-4", "mt-5");
    });
  });
});
