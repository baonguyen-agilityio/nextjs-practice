import { render, screen, fireEvent } from "@testing-library/react";
import { ArticleDetails } from "../ArticleDetails";
import type { Article } from "@/types";

jest.mock("@/components/ui/Banner", () => ({
  Banner: ({ title }: { title: string }) => <div data-testid="banner">{title}</div>,
}));

jest.mock("@/components/ui/BackButton", () => {
  return function MockBackButton() {
    return (
      <button onClick={() => window.history.back()} data-testid="back-button">
        ← Back to list
      </button>
    );
  };
});

jest.mock("@/components/ui/ImageWithFallback", () => {
  return function MockImageWithFallback({ src, alt, fallbackText }: any) {
    return <img src={src} alt={alt} data-fallback={fallbackText} data-testid="article-image" />;
  };
});

jest.mock("@/utils/image", () => ({
  createImageUrl: (url: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    if (!baseUrl || url.startsWith("http")) return url;
    return `${baseUrl}${url}`;
  },
  ImageQuality: {
    HIGH: 90,
    STANDARD: 85,
    THUMBNAIL: 75,
    PLACEHOLDER: 30,
  },
}));

jest.mock("@/utils/date", () => ({
  formatDate: (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },
}));

Object.defineProperty(window, "history", {
  value: { back: jest.fn() },
  writable: true,
});

describe("ArticleDetails", () => {
  const mockArticle: Article = {
    id: "1",
    documentId: "doc-1",
    slug: "test-article",
    title: "Test Article",
    description: "Test description",
    content: "This is a test article content with formatting.",
    imageUrl: "/test-image.jpg",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
    author: { name: "John Doe" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_STRAPI_URL = "http://localhost:1337";
  });

  describe("Rendering", () => {
    it("renders all main components", () => {
      render(<ArticleDetails article={mockArticle} />);

      expect(screen.getByTestId("banner")).toBeInTheDocument();
      expect(screen.getByTestId("back-button")).toBeInTheDocument();
      expect(screen.getByTestId("article-image")).toBeInTheDocument();
    });

    it("displays banner with correct title", () => {
      render(<ArticleDetails article={mockArticle} />);

      expect(screen.getByTestId("banner")).toHaveTextContent(
        "Significant reading has more info number"
      );
    });

    it("displays article information", () => {
      render(<ArticleDetails article={mockArticle} />);

      expect(screen.getByText("Test Article")).toBeInTheDocument();
      expect(screen.getByText("January 1, 2023 / John Doe")).toBeInTheDocument();
      expect(
        screen.getByText("This is a test article content with formatting.")
      ).toBeInTheDocument();
    });
  });

  describe("Image handling", () => {
    it("renders image with environment URL", () => {
      render(<ArticleDetails article={mockArticle} />);

      const image = screen.getByTestId("article-image");
      expect(image).toHaveAttribute("src", "http://localhost:1337/test-image.jpg");
      expect(image).toHaveAttribute("alt", "Cover image of Test Article article");
      expect(image).toHaveAttribute("data-fallback", "Article Image");
    });

    it("handles missing environment variable", () => {
      delete process.env.NEXT_PUBLIC_STRAPI_URL;

      render(<ArticleDetails article={mockArticle} />);

      const image = screen.getByTestId("article-image");
      expect(image).toHaveAttribute("src", "/test-image.jpg");
    });

    it("handles absolute URLs", () => {
      const articleWithAbsoluteUrl = {
        ...mockArticle,
        imageUrl: "https://example.com/image.jpg",
      };

      render(<ArticleDetails article={articleWithAbsoluteUrl} />);

      const image = screen.getByTestId("article-image");
      expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    });
  });

  describe("User interactions", () => {
    it("handles back button click", () => {
      render(<ArticleDetails article={mockArticle} />);

      fireEvent.click(screen.getByTestId("back-button"));

      expect(window.history.back).toHaveBeenCalled();
    });
  });

  describe("Content display", () => {
    it("displays author when available", () => {
      render(<ArticleDetails article={mockArticle} />);

      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });

    it("handles missing author gracefully", () => {
      const articleWithoutAuthor = {
        ...mockArticle,
        author: { name: "" },
      };

      render(<ArticleDetails article={articleWithoutAuthor} />);

      expect(screen.getByText(/January 1, 2023/)).toBeInTheDocument();
    });

    it("displays article content", () => {
      const articleWithComplexContent = {
        ...mockArticle,
        content: "Complex content with special characters & symbols!",
      };

      render(<ArticleDetails article={articleWithComplexContent} />);

      expect(
        screen.getByText("Complex content with special characters & symbols!")
      ).toBeInTheDocument();
    });
  });

  describe("Layout structure", () => {
    it("has correct CSS classes and structure", () => {
      const { container } = render(<ArticleDetails article={mockArticle} />);

      const section = container.querySelector("section");
      expect(section).toHaveClass("container", "mx-auto", "px-4", "max-w-7xl");

      const article = container.querySelector("article");
      expect(article).toHaveClass("space-y-4");

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });
  });
});
