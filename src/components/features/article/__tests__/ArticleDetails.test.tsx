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
  return function MockImage({ src, alt, layout, width, height, objectFit }: any) {
    return (
      <img
        src={src}
        alt={alt}
        data-layout={layout}
        data-width={width}
        data-height={height}
        data-object-fit={objectFit}
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

  it("should render article details with all elements", () => {
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
    expect(backButton).toHaveAttribute("data-variant", "light");
    expect(backButton).toHaveClass("text-description");
  });

  it("should handle back button click", () => {
    render(<ArticleDetails article={mockArticle} />);

    const backButton = screen.getByTestId("button");
    fireEvent.click(backButton);

    expect(window.history.back).toHaveBeenCalled();
  });

  it("should render image with correct props", () => {
    render(<ArticleDetails article={mockArticle} />);

    const image = screen.getByTestId("article-image");
    expect(image).toHaveAttribute("src", "http://localhost:1337/test-image.jpg");
    expect(image).toHaveAttribute("alt", "article");
    expect(image).toHaveAttribute("data-layout", "responsive");
    expect(image).toHaveAttribute("data-width", "600");
    expect(image).toHaveAttribute("data-height", "400");
    expect(image).toHaveAttribute("data-object-fit", "contain");
  });

  it("should display published date", () => {
    render(<ArticleDetails article={mockArticle} />);

    expect(screen.getByText("2023-01-01T00:00:00.000Z / Author")).toBeInTheDocument();
  });

  it("should render content with HTML", () => {
    const { container } = render(<ArticleDetails article={mockArticle} />);

    expect(container.textContent).toContain("This is a test article content");
    expect(container.textContent).toContain("HTML");
  });

  it("should have correct container structure", () => {
    const { container } = render(<ArticleDetails article={mockArticle} />);

    const section = container.querySelector("section");
    expect(section).toHaveClass("container", "mx-auto", "px-4", "max-w-7xl");
  });

  it("should have correct spacing classes", () => {
    const { container } = render(<ArticleDetails article={mockArticle} />);

    const paddingDiv = container.querySelector(".py-10");
    expect(paddingDiv).toHaveClass("py-10", "md:p-16", "lg:p-20");

    const spacingDiv = container.querySelector(".space-y-4");
    expect(spacingDiv).toHaveClass("space-y-4", "mt-5");
  });

  it("should handle article with empty content", () => {
    const articleWithEmptyContent = {
      ...mockArticle,
      content: "",
    };

    const { container } = render(<ArticleDetails article={articleWithEmptyContent} />);

    expect(container.querySelector(".space-y-4")).toBeInTheDocument();
  });

  it("should handle article with null content", () => {
    const articleWithNullContent = {
      ...mockArticle,
      content: null as any,
    };

    const { container } = render(<ArticleDetails article={articleWithNullContent} />);

    expect(container.querySelector(".space-y-4")).toBeInTheDocument();
  });

  it("should handle different image URLs", () => {
    const articleWithDifferentImage = {
      ...mockArticle,
      imageUrl: "/different-image.png",
    };

    render(<ArticleDetails article={articleWithDifferentImage} />);

    const image = screen.getByTestId("article-image");
    expect(image).toHaveAttribute("src", "http://localhost:1337/different-image.png");
  });

  it("should handle missing environment variable", () => {
    delete process.env.NEXT_PUBLIC_STRAPI_URL;

    render(<ArticleDetails article={mockArticle} />);

    const image = screen.getByTestId("article-image");
    expect(image).toHaveAttribute("src", "undefined/test-image.jpg");
  });

  it("should handle long published date", () => {
    const articleWithLongDate = {
      ...mockArticle,
      publishedAt: "2023-12-31T23:59:59.999Z",
    };

    render(<ArticleDetails article={articleWithLongDate} />);

    expect(screen.getByText("2023-12-31T23:59:59.999Z / Author")).toBeInTheDocument();
  });

  it("should have proper semantic structure", () => {
    const { container } = render(<ArticleDetails article={mockArticle} />);

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should render content with complex HTML", () => {
    const articleWithComplexContent = {
      ...mockArticle,
      content:
        "<div><h2>Title</h2><p>Paragraph with <a href='#'>link</a></p><ul><li>Item 1</li><li>Item 2</li></ul></div>",
    };

    const { container } = render(<ArticleDetails article={articleWithComplexContent} />);

    expect(container.textContent).toContain("Title");
    expect(container.textContent).toContain("Paragraph with link");
    expect(container.textContent).toContain("Item 1");
    expect(container.textContent).toContain("Item 2");
  });

  it("should handle special characters in content", () => {
    const articleWithSpecialChars = {
      ...mockArticle,
      content: "<p>Content with special chars: &lt;&gt;&amp;&quot;&#39;</p>",
    };

    const { container } = render(<ArticleDetails article={articleWithSpecialChars} />);

    expect(container.textContent).toContain("Content with special chars");
  });
});
