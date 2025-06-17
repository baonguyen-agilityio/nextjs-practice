import { render, screen } from "@testing-library/react";
import ArchiveLayout from "../layout";

describe("Books Layout", () => {
  const mockBooksContent = <div data-testid="books-content">Books Content</div>;
  const mockArticlesContent = <div data-testid="articles-content">Articles Content</div>;

  it("should render the layout with correct structure", () => {
    render(<ArchiveLayout books={mockBooksContent} articles={mockArticlesContent} />);

    expect(screen.getByRole("heading", { level: 1, name: "My Store" })).toBeInTheDocument();

    expect(screen.getByText(/Looking for your next great read/i)).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "Articles & Resources" })
    ).toBeInTheDocument();
  });

  it("should render books content in the correct section", () => {
    render(<ArchiveLayout books={mockBooksContent} articles={mockArticlesContent} />);

    const booksContent = screen.getByTestId("books-content");
    expect(booksContent).toBeInTheDocument();
    expect(booksContent.textContent).toBe("Books Content");
  });

  it("should render articles content in the correct section", () => {
    render(<ArchiveLayout books={mockBooksContent} articles={mockArticlesContent} />);

    const articlesContent = screen.getByTestId("articles-content");
    expect(articlesContent).toBeInTheDocument();
    expect(articlesContent.textContent).toBe("Articles Content");
  });

  it("should have correct CSS classes for styling", () => {
    const { container } = render(
      <ArchiveLayout books={mockBooksContent} articles={mockArticlesContent} />
    );

    const heroSection = container.querySelector(".bg-primary");
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveClass("text-white", "py-16");

    const articlesSection = container.querySelector(".bg-background");
    expect(articlesSection).toBeInTheDocument();
    expect(articlesSection).toHaveClass("py-16");
  });

  it("should render container with responsive classes", () => {
    const { container } = render(
      <ArchiveLayout books={mockBooksContent} articles={mockArticlesContent} />
    );

    const containers = container.querySelectorAll(".container");
    containers.forEach((containerEl) => {
      expect(containerEl).toHaveClass("mx-auto", "px-4", "max-w-7xl");
    });
  });

  it("should render decorative separator", () => {
    const { container } = render(
      <ArchiveLayout books={mockBooksContent} articles={mockArticlesContent} />
    );

    const separator = container.querySelector(".w-10.h-1.bg-secondary");
    expect(separator).toBeInTheDocument();
  });

  it("should accept React.ReactNode types for both slots", () => {
    const complexBooksContent = (
      <div>
        <h3>Books</h3>
        <ul>
          <li>Book 1</li>
          <li>Book 2</li>
        </ul>
      </div>
    );

    const complexArticlesContent = (
      <div>
        <h3>Articles</h3>
        <p>Some articles content</p>
      </div>
    );

    render(<ArchiveLayout books={complexBooksContent} articles={complexArticlesContent} />);

    expect(screen.getByText("Books")).toBeInTheDocument();
    expect(screen.getByText("Book 1")).toBeInTheDocument();
    expect(screen.getByText("Articles")).toBeInTheDocument();
    expect(screen.getByText("Some articles content")).toBeInTheDocument();
  });

  it("should handle null or undefined content gracefully", () => {
    render(<ArchiveLayout books={null} articles={undefined} />);

    expect(screen.getByRole("heading", { level: 1, name: "My Store" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Articles & Resources" })
    ).toBeInTheDocument();
  });

  it("should have semantic HTML structure", () => {
    const { container } = render(
      <ArchiveLayout books={mockBooksContent} articles={mockArticlesContent} />
    );

    const sections = container.querySelectorAll("section");
    expect(sections).toHaveLength(3);
  });

  it("should have proper font classes applied", () => {
    const { container } = render(
      <ArchiveLayout books={mockBooksContent} articles={mockArticlesContent} />
    );

    const description = container.querySelector(".font-inter");
    expect(description).toBeInTheDocument();

    const heading = container.querySelector(".font-cardo");
    expect(heading).toBeInTheDocument();
  });
});
