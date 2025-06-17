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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render article card with all elements", () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("card-body")).toBeInTheDocument();
    expect(screen.getByTestId("card-footer")).toBeInTheDocument();
    expect(screen.getByTestId("hero-image")).toBeInTheDocument();
  });

  it("should display article title", () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText("Test Article")).toBeInTheDocument();
  });

  it("should display article content", () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText("This is a test article content")).toBeInTheDocument();
  });

  it("should display author name", () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should display formatted published date", () => {
    const { formatDate } = require("@/utils/date");
    render(<ArticleCard article={mockArticle} />);

    expect(formatDate).toHaveBeenCalledWith("2023-01-01T00:00:00.000Z");
    expect(screen.getByText("formatted-2023-01-01T00:00:00.000Z")).toBeInTheDocument();
  });

  it("should render image with correct src and alt", () => {
    render(<ArticleCard article={mockArticle} />);

    const image = screen.getByTestId("hero-image");
    expect(image).toHaveAttribute("src", "http://localhost:1337/test-image.jpg");
    expect(image).toHaveAttribute("alt", "Card background");
  });

  it("should render read more link with correct href", () => {
    render(<ArticleCard article={mockArticle} />);

    const readMoreLink = screen.getByRole("link", { name: "Read more" });
    expect(readMoreLink).toHaveAttribute("href", "/articles/doc-1");
  });

  it("should apply correct CSS classes", () => {
    render(<ArticleCard article={mockArticle} />);

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("shadow-none", "rounded-none");

    const cardBody = screen.getByTestId("card-body");
    expect(cardBody).toHaveClass("overflow-visible", "p-0");

    const cardFooter = screen.getByTestId("card-footer");
    expect(cardFooter).toHaveClass("flex", "flex-col", "gap-5", "text-left", "items-start", "p-5");
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

  it("should handle article without published date", () => {
    const { formatDate } = require("@/utils/date");
    const articleWithoutDate = {
      ...mockArticle,
      publishedAt: "",
    };

    render(<ArticleCard article={articleWithoutDate} />);

    expect(formatDate).toHaveBeenCalledWith("");
  });

  it("should handle long article title", () => {
    const articleWithLongTitle: Article = {
      ...mockArticle,
      title:
        "This is a very long article title that should still be displayed properly in the card",
    };

    render(<ArticleCard article={articleWithLongTitle} />);

    expect(
      screen.getByText(
        "This is a very long article title that should still be displayed properly in the card"
      )
    ).toBeInTheDocument();
  });

  it("should handle long article content", () => {
    const articleWithLongContent: Article = {
      ...mockArticle,
      content:
        "This is a very long article content that should be displayed in the description area. It might be truncated or styled differently based on the CSS but should still be accessible.",
    };

    render(<ArticleCard article={articleWithLongContent} />);

    expect(screen.getByText(/This is a very long article content/)).toBeInTheDocument();
  });

  it("should handle special characters in title and content", () => {
    const articleWithSpecialChars: Article = {
      ...mockArticle,
      title: "Test Article with Special Characters: @#$%",
      content: "Content with special chars: <>&\"'",
    };

    render(<ArticleCard article={articleWithSpecialChars} />);

    expect(screen.getByText("Test Article with Special Characters: @#$%")).toBeInTheDocument();
    expect(screen.getByText("Content with special chars: <>&\"'")).toBeInTheDocument();
  });

  it("should handle missing image URL", () => {
    const articleWithoutImage: Article = {
      ...mockArticle,
      imageUrl: "",
    };

    render(<ArticleCard article={articleWithoutImage} />);

    const image = screen.getByTestId("hero-image");
    expect(image).toHaveAttribute("src", "http://localhost:1337");
  });

  it("should have proper accessibility attributes", () => {
    render(<ArticleCard article={mockArticle} />);

    const image = screen.getByTestId("hero-image");
    expect(image).toHaveAttribute("alt", "Card background");

    const readMoreLink = screen.getByRole("link", { name: "Read more" });
    expect(readMoreLink).toBeInTheDocument();
  });

  it("should use environment variable for image URL", () => {
    process.env.NEXT_PUBLIC_STRAPI_URL = "https://api.example.com";

    render(<ArticleCard article={mockArticle} />);

    const image = screen.getByTestId("hero-image");
    expect(image).toHaveAttribute("src", "https://api.example.com/test-image.jpg");
  });

  it("should handle missing environment variable", () => {
    delete process.env.NEXT_PUBLIC_STRAPI_URL;

    render(<ArticleCard article={mockArticle} />);

    const image = screen.getByTestId("hero-image");
    expect(image).toHaveAttribute("src", "undefined/test-image.jpg");
  });
});
