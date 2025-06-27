import { render, screen } from "@testing-library/react";
import ArchiveLayout from "../layout";

describe("Books Layout", () => {
  const mockBooks = <div data-testid="books-content">Books Content</div>;
  const mockArticles = <div data-testid="articles-content">Articles Content</div>;

  describe("Layout Structure", () => {
    it("should render all sections with correct content", () => {
      render(<ArchiveLayout books={mockBooks} articles={mockArticles} />);

      expect(screen.getByRole("heading", { level: 1, name: "Our Store" })).toBeInTheDocument();
      expect(screen.getByText(/Looking for your next great read/)).toBeInTheDocument();

      expect(screen.getByTestId("books-content")).toBeInTheDocument();

      expect(
        screen.getByRole("heading", { level: 2, name: "Articles & Resources" })
      ).toBeInTheDocument();
      expect(screen.getByTestId("articles-content")).toBeInTheDocument();
    });

    it("should render books content", () => {
      render(<ArchiveLayout books={mockBooks} articles={mockArticles} />);

      const booksContent = screen.getByTestId("books-content");
      expect(booksContent).toBeInTheDocument();
      expect(booksContent).toHaveTextContent("Books Content");
    });

    it("should render articles content", () => {
      render(<ArchiveLayout books={mockBooks} articles={mockArticles} />);

      const articlesContent = screen.getByTestId("articles-content");
      expect(articlesContent).toBeInTheDocument();
      expect(articlesContent).toHaveTextContent("Articles Content");
    });
  });

  describe("Content Handling", () => {
    it("should handle complex React nodes", () => {
      const complexBooks = (
        <div>
          <h3>Book List</h3>
          <ul>
            <li>Book 1</li>
            <li>Book 2</li>
          </ul>
        </div>
      );

      const complexArticles = (
        <div>
          <h3>Article List</h3>
          <p>Article content here</p>
        </div>
      );

      render(<ArchiveLayout books={complexBooks} articles={complexArticles} />);

      expect(screen.getByText("Book List")).toBeInTheDocument();
      expect(screen.getByText("Book 1")).toBeInTheDocument();
      expect(screen.getByText("Article List")).toBeInTheDocument();
      expect(screen.getByText("Article content here")).toBeInTheDocument();
    });

    it("should handle null/undefined content", () => {
      render(<ArchiveLayout books={null} articles={undefined} />);

      expect(screen.getByRole("heading", { name: "Our Store" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Articles & Resources" })).toBeInTheDocument();
    });

    it("should handle empty content", () => {
      render(<ArchiveLayout books={<></>} articles={<></>} />);

      expect(screen.getByRole("heading", { name: "Our Store" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Articles & Resources" })).toBeInTheDocument();
    });
  });

  describe("Prop Types", () => {
    it("should accept ReactNode for books prop", () => {
      const booksNode = <span>Books as ReactNode</span>;
      render(<ArchiveLayout books={booksNode} articles={mockArticles} />);

      expect(screen.getByText("Books as ReactNode")).toBeInTheDocument();
    });

    it("should accept ReactNode for articles prop", () => {
      const articlesNode = <span>Articles as ReactNode</span>;
      render(<ArchiveLayout books={mockBooks} articles={articlesNode} />);

      expect(screen.getByText("Articles as ReactNode")).toBeInTheDocument();
    });
  });
});
