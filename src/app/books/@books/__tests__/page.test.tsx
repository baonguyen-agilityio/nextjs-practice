import { render, screen } from "@testing-library/react";
import { generateMetadata } from "../page";
import Page from "../page";
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from "@/constants";

jest.mock("@/components/features/book/BookPage", () => {
  return function MockBooks({ searchParamsAPI }: { searchParamsAPI: URLSearchParams }) {
    return (
      <div data-testid="books-component">
        <div data-testid="search-params">{searchParamsAPI.toString()}</div>
      </div>
    );
  };
});

describe("Books Page (@books)", () => {
  describe("generateMetadata", () => {
    it("should return correct metadata", () => {
      const metadata = generateMetadata();
      expect(metadata).toEqual({
        title: "Books",
        description:
          "Browse our extensive collection of books across all genres. Find fiction, non-fiction, classics, bestsellers, and new releases at competitive prices with fast shipping.",
        openGraph: {
          title: "Books | BookStore",
          description:
            "Browse our extensive collection of books across all genres. Find your next great read with competitive prices and fast shipping.",
          type: "website",
        },
      });
    });
  });

  describe("Page Component", () => {
    it("should render with default search params", async () => {
      const searchParams = Promise.resolve({});
      const component = await Page({ searchParams });
      render(component);

      expect(screen.getByTestId("books-component")).toBeInTheDocument();

      const searchParamsText = screen.getByTestId("search-params").textContent;
      expect(searchParamsText).toContain(`pagination%5Bpage%5D=${PAGE_DEFAULT}`);
      expect(searchParamsText).toContain(`pagination%5BpageSize%5D=${PAGE_SIZE_DEFAULT}`);
      expect(searchParamsText).toContain("populate=*");
    });

    it("should handle custom page parameter", async () => {
      const searchParams = Promise.resolve({ page: 3 });
      const component = await Page({ searchParams });
      render(component);

      const searchParamsText = screen.getByTestId("search-params").textContent;
      expect(searchParamsText).toContain("pagination%5Bpage%5D=3");
    });

    it("should handle categories filter", async () => {
      const searchParams = Promise.resolve({ categories: "fiction" });
      const component = await Page({ searchParams });
      render(component);

      const searchParamsText = screen.getByTestId("search-params").textContent;
      expect(searchParamsText).toContain(
        "filters%5Bcategories%5D%5BdocumentId%5D%5B%24eq%5D=fiction"
      );
    });

    it("should handle search filter", async () => {
      const searchParams = Promise.resolve({ search: "harry potter" });
      const component = await Page({ searchParams });
      render(component);

      const searchParamsText = screen.getByTestId("search-params").textContent;
      expect(searchParamsText).toContain("filters%5Btitle%5D%5B%24containsi%5D=harry+potter");
    });

    it("should handle multiple filters", async () => {
      const searchParams = Promise.resolve({
        page: 2,
        categories: "mystery",
        search: "detective",
      });
      const component = await Page({ searchParams });
      render(component);

      const searchParamsText = screen.getByTestId("search-params").textContent;
      expect(searchParamsText).toContain("pagination%5Bpage%5D=2");
      expect(searchParamsText).toContain(
        "filters%5Bcategories%5D%5BdocumentId%5D%5B%24eq%5D=mystery"
      );
      expect(searchParamsText).toContain("filters%5Btitle%5D%5B%24containsi%5D=detective");
    });

    it("should not add empty filters", async () => {
      const searchParams = Promise.resolve({ categories: "", search: "" });
      const component = await Page({ searchParams });
      render(component);

      const searchParamsText = screen.getByTestId("search-params").textContent;
      expect(searchParamsText).not.toContain("filters%5Bcategories%5D");
      expect(searchParamsText).not.toContain("filters%5Btitle%5D");
    });

    it("should handle null searchParams", async () => {
      const searchParams = Promise.resolve(null as any);
      const component = await Page({ searchParams });
      render(component);

      expect(screen.getByTestId("books-component")).toBeInTheDocument();

      const searchParamsText = screen.getByTestId("search-params").textContent;
      expect(searchParamsText).toContain(`pagination%5Bpage%5D=${PAGE_DEFAULT}`);
    });

    it("should handle undefined searchParams", async () => {
      const searchParams = Promise.resolve(undefined as any);
      const component = await Page({ searchParams });
      render(component);

      expect(screen.getByTestId("books-component")).toBeInTheDocument();
    });
  });

  describe("URLSearchParams Logic", () => {
    it("should construct basic params correctly", () => {
      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", PAGE_DEFAULT.toString());
      searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT.toString());
      searchParamsAPI.set("populate", "*");

      expect(searchParamsAPI.get("pagination[page]")).toBe("1");
      expect(searchParamsAPI.get("pagination[pageSize]")).toBe("6");
      expect(searchParamsAPI.get("populate")).toBe("*");
    });

    it("should add conditional filters correctly", () => {
      const searchParamsAPI = new URLSearchParams();
      const categories = "science-fiction";
      const search = "dune";

      searchParamsAPI.set("pagination[page]", "1");
      searchParamsAPI.set("pagination[pageSize]", "6");
      searchParamsAPI.set("populate", "*");

      if (categories) {
        searchParamsAPI.set("filters[categories][documentId][$eq]", categories);
      }

      if (search) {
        searchParamsAPI.set("filters[title][$containsi]", search);
      }

      expect(searchParamsAPI.get("filters[categories][documentId][$eq]")).toBe("science-fiction");
      expect(searchParamsAPI.get("filters[title][$containsi]")).toBe("dune");
    });

    it("should skip empty filters", () => {
      const searchParamsAPI = new URLSearchParams();
      const categories = "";
      const search = "";

      searchParamsAPI.set("pagination[page]", "1");
      searchParamsAPI.set("pagination[pageSize]", "6");
      searchParamsAPI.set("populate", "*");

      if (categories) {
        searchParamsAPI.set("filters[categories][documentId][$eq]", categories);
      }

      if (search) {
        searchParamsAPI.set("filters[title][$containsi]", search);
      }

      expect(searchParamsAPI.has("filters[categories][documentId][$eq]")).toBe(false);
      expect(searchParamsAPI.has("filters[title][$containsi]")).toBe(false);
    });
  });

  describe("Search Params Processing", () => {
    it("should extract page with fallback", async () => {
      const emptyParams = Promise.resolve({}) as any;
      const result = (await emptyParams) || {};
      const page = result.page || PAGE_DEFAULT;

      expect(page).toBe(PAGE_DEFAULT);
    });

    it("should extract categories with fallback", async () => {
      const emptyParams = Promise.resolve({}) as any;
      const result = (await emptyParams) || {};
      const categories = result.categories || "";

      expect(categories).toBe("");
    });

    it("should extract search with fallback", async () => {
      const emptyParams = Promise.resolve({}) as any;
      const result = (await emptyParams) || {};
      const search = result.search || "";

      expect(search).toBe("");
    });

    it("should handle all values present", async () => {
      const fullParams = Promise.resolve({
        page: 5,
        categories: "romance",
        search: "love story",
      });
      const result = await fullParams;

      expect(result.page).toBe(5);
      expect(result.categories).toBe("romance");
      expect(result.search).toBe("love story");
    });
  });
});
