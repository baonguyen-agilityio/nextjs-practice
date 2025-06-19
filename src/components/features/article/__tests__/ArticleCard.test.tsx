import { render, screen } from "@testing-library/react";
import { ArticleCard } from "../ArticleCard";
import type { Article } from "@/types";

jest.mock("@/utils/date", () => ({
  formatDate: jest.fn((date) => `formatted-${date}`),
}));

jest.mock("next/link", () => {
  return function MockLink({ children, href, className }: any) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

jest.mock("@heroui/react", () => ({
  Card: function MockCard({ children, className }: any) {
    return (
      <div className={className} data-testid="card">
        {children}
      </div>
    );
  },
  CardBody: function MockCardBody({ children, className }: any) {
    return (
      <div className={className} data-testid="card-body">
        {children}
      </div>
    );
  },
  CardFooter: function MockCardFooter({ children, className }: any) {
    return (
      <div className={className} data-testid="card-footer">
        {children}
      </div>
    );
  },
  Image: function MockImage({ alt, src, width }: any) {
    return <img alt={alt} src={src} width={width} data-testid="hero-image" />;
  },
}));

describe("ArticleCard", () => {
  const mockArticle: Article = {
    id: "1",
    documentId: "doc-1",
    slug: "test-article",
    title: "Test Article",
    description: "Test description",
    content: "This is a test article content",
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
    it("should render article card with all elements", () => {
      render(<ArticleCard article={mockArticle} />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("card-body")).toBeInTheDocument();
      expect(screen.getByTestId("card-footer")).toBeInTheDocument();
      expect(screen.getByTestId("hero-image")).toBeInTheDocument();
    });

    it("should display article content", () => {
      render(<ArticleCard article={mockArticle} />);

      expect(screen.getByText("Test Article")).toBeInTheDocument();
      expect(screen.getByText("This is a test article content")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  describe("Date and Author", () => {
    it("should display formatted published date", () => {
      const { formatDate } = require("@/utils/date");
      render(<ArticleCard article={mockArticle} />);

      expect(formatDate).toHaveBeenCalledWith("2023-01-01T00:00:00.000Z");
      expect(screen.getByText("formatted-2023-01-01T00:00:00.000Z")).toBeInTheDocument();
    });

    it("should handle article without author", () => {
      const articleWithoutAuthor = {
        ...mockArticle,
        author: { name: "" },
      };

      render(<ArticleCard article={articleWithoutAuthor} />);

      expect(screen.getByText("Test Article")).toBeInTheDocument();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  describe("Image Handling", () => {
    it("should render image with environment URL", () => {
      render(<ArticleCard article={mockArticle} />);

      const image = screen.getByTestId("hero-image");
      expect(image).toHaveAttribute("src", expect.stringContaining("test-image.jpg"));
      expect(image).toHaveAttribute("alt", "Card background");
    });

    it("should handle missing environment variable", () => {
      delete process.env.NEXT_PUBLIC_STRAPI_URL;

      render(<ArticleCard article={mockArticle} />);

      const image = screen.getByTestId("hero-image");
      expect(image).toHaveAttribute("src", expect.stringContaining("%2Ftest-image.jpg"));
    });
  });

  describe("Navigation", () => {
    it("should render read more link with correct href", () => {
      render(<ArticleCard article={mockArticle} />);

      const readMoreLink = screen.getByRole("link", { name: "Read more" });
      expect(readMoreLink).toHaveAttribute("href", "/articles/doc-1");
    });
  });

  describe("CSS Classes", () => {
    it("should apply correct CSS classes", () => {
      render(<ArticleCard article={mockArticle} />);

      const card = screen.getByTestId("card");
      expect(card).toHaveClass("shadow-none", "rounded-none");

      const cardBody = screen.getByTestId("card-body");
      expect(cardBody).toHaveClass("overflow-visible", "p-0");

      const cardFooter = screen.getByTestId("card-footer");
      expect(cardFooter).toHaveClass(
        "flex",
        "flex-col",
        "gap-5",
        "text-left",
        "items-start",
        "p-5"
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle long content", () => {
      const articleWithLongContent: Article = {
        ...mockArticle,
        title: "This is a very long article title",
        content: "This is a very long article content that should be displayed properly.",
      };

      render(<ArticleCard article={articleWithLongContent} />);

      expect(screen.getByText("This is a very long article title")).toBeInTheDocument();
      expect(screen.getByText(/This is a very long article content/)).toBeInTheDocument();
    });

    it("should handle special characters", () => {
      const articleWithSpecialChars: Article = {
        ...mockArticle,
        title: "Test Article with Special Characters: @#$%",
        content: "Content with special chars: <>&\"'",
      };

      render(<ArticleCard article={articleWithSpecialChars} />);

      expect(screen.getByText("Test Article with Special Characters: @#$%")).toBeInTheDocument();
      expect(screen.getByText("Content with special chars: <>&\"'")).toBeInTheDocument();
    });
  });
});
