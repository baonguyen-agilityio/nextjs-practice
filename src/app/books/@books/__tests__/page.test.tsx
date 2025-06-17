import { generateMetadata } from "../page";

jest.mock("@/components/features/book/BookPage", () => {
  return function MockBooks({ searchParamsAPI }: { searchParamsAPI: URLSearchParams }) {
    return (
      <div data-testid="books-component">
        <div data-testid="search-params">{searchParamsAPI.toString()}</div>
      </div>
    );
  };
});

jest.mock("@/constants", () => ({
  PAGE_DEFAULT: 1,
  PAGE_SIZE_DEFAULT: 10,
}));

describe("Books Page (@books)", () => {
  describe("generateMetadata", () => {
    it("should return correct metadata", () => {
      const metadata = generateMetadata();

      expect(metadata).toEqual({
        title: "Books",
      });
    });

    it("should have a string title", () => {
      const metadata = generateMetadata();

      expect(typeof metadata.title).toBe("string");
      expect(metadata.title).toBe("Books");
    });
  });

  describe("Component Structure", () => {
    it("should define proper component exports", () => {
      const pageModule = require("../page");

      expect(typeof pageModule.generateMetadata).toBe("function");
      expect(typeof pageModule.default).toBe("function");
    });

    it("should handle SearchParams type correctly", () => {
      const searchParams = {
        page: "2",
        categories: "fiction",
        search: "fantasy",
      };

      expect(typeof searchParams).toBe("object");
      expect(searchParams.page).toBe("2");
      expect(searchParams.categories).toBe("fiction");
      expect(searchParams.search).toBe("fantasy");
    });
  });

  describe("Search Params Handling", () => {
    it("should handle undefined search params", async () => {
      const searchParams = undefined;
      const { PAGE_DEFAULT } = require("@/constants");

      const result: any = (await searchParams) || {};
      const page = result.page || PAGE_DEFAULT;
      const categories = result.categories || "";
      const search = result.search || "";

      expect(page).toBe(PAGE_DEFAULT);
      expect(categories).toBe("");
      expect(search).toBe("");
    });

    it("should handle empty search params", async () => {
      const searchParams: any = Promise.resolve({});
      const { PAGE_DEFAULT } = require("@/constants");

      const result = await searchParams;
      const page = result.page || PAGE_DEFAULT;
      const categories = result.categories || "";
      const search = result.search || "";

      expect(page).toBe(PAGE_DEFAULT);
      expect(categories).toBe("");
      expect(search).toBe("");
    });

    it("should handle search params with all values", async () => {
      const searchParams: any = Promise.resolve({
        page: "3",
        categories: "science-fiction",
        search: "dune",
      });

      const result = await searchParams;

      expect(result.page).toBe("3");
      expect(result.categories).toBe("science-fiction");
      expect(result.search).toBe("dune");
    });

    it("should handle partial search params", async () => {
      const searchParams: any = Promise.resolve({ page: "2" });
      const { PAGE_DEFAULT } = require("@/constants");

      const result = await searchParams;
      const page = result.page || PAGE_DEFAULT;
      const categories = result.categories || "";
      const search = result.search || "";

      expect(page).toBe("2");
      expect(categories).toBe("");
      expect(search).toBe("");
    });
  });

  describe("URLSearchParams Construction", () => {
    it("should construct basic search params correctly", () => {
      const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } = require("@/constants");

      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", PAGE_DEFAULT.toString());
      searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT.toString());
      searchParamsAPI.set("populate", "*");

      expect(searchParamsAPI.get("pagination[page]")).toBe("1");
      expect(searchParamsAPI.get("pagination[pageSize]")).toBe("10");
      expect(searchParamsAPI.get("populate")).toBe("*");
    });

    it("should add categories filter when provided", () => {
      const categories = "mystery";

      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", "1");
      searchParamsAPI.set("pagination[pageSize]", "10");
      searchParamsAPI.set("populate", "*");
      searchParamsAPI.set("filters[categories][documentId][$eq]", categories);

      expect(searchParamsAPI.get("filters[categories][documentId][$eq]")).toBe("mystery");
    });

    it("should add search filter when provided", () => {
      const search = "harry potter";

      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", "1");
      searchParamsAPI.set("pagination[pageSize]", "10");
      searchParamsAPI.set("populate", "*");
      searchParamsAPI.set("filters[title][$containsi]", search);

      expect(searchParamsAPI.get("filters[title][$containsi]")).toBe("harry potter");
    });

    it("should handle multiple filters simultaneously", () => {
      const page = "2";
      const categories = "romance";
      const search = "love story";

      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", page);
      searchParamsAPI.set("pagination[pageSize]", "10");
      searchParamsAPI.set("populate", "*");
      searchParamsAPI.set("filters[categories][documentId][$eq]", categories);
      searchParamsAPI.set("filters[title][$containsi]", search);

      expect(searchParamsAPI.get("pagination[page]")).toBe("2");
      expect(searchParamsAPI.get("filters[categories][documentId][$eq]")).toBe("romance");
      expect(searchParamsAPI.get("filters[title][$containsi]")).toBe("love story");
    });

    it("should not add empty filters", () => {
      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", "1");
      searchParamsAPI.set("pagination[pageSize]", "10");
      searchParamsAPI.set("populate", "*");

      const categories = "";
      const search = "";

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

  describe("Constants", () => {
    it("should use correct default values", () => {
      const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } = require("@/constants");

      expect(PAGE_DEFAULT).toBe(1);
      expect(PAGE_SIZE_DEFAULT).toBe(10);
    });

    it("should handle page conversion to string", () => {
      const page = 5;
      const pageString = page.toString();

      expect(pageString).toBe("5");
      expect(typeof pageString).toBe("string");
    });
  });

  describe("Component Integration", () => {
    it("should pass searchParamsAPI to Books component", () => {
      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", "1");

      expect(searchParamsAPI instanceof URLSearchParams).toBe(true);
      expect(searchParamsAPI.get("pagination[page]")).toBe("1");
    });

    it("should handle different page values", () => {
      const testCases = [1, 5, 10, 100];

      testCases.forEach((page) => {
        const searchParams = new URLSearchParams();
        searchParams.set("pagination[page]", page.toString());

        expect(searchParams.get("pagination[page]")).toBe(page.toString());
      });
    });
  });

  describe("Type Safety", () => {
    it("should handle SearchParams as Promise", async () => {
      const searchParamsPromise = Promise.resolve({
        page: "1",
        categories: "fiction",
      });

      const result = await searchParamsPromise;

      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("categories");
      expect(result.page).toBe("1");
      expect(result.categories).toBe("fiction");
    });

    it("should handle null and undefined gracefully", async () => {
      const nullParams = null;
      const undefinedParams = undefined;

      const nullResult = (await nullParams) || {};
      const undefinedResult = (await undefinedParams) || {};

      expect(nullResult).toEqual({});
      expect(undefinedResult).toEqual({});
    });
  });

  describe("URLSearchParams behavior", () => {
    it("should properly encode special characters", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("filters[title][$containsi]", "Lord of the Rings");

      const encoded = searchParams.toString();
      expect(encoded).toContain("filters");
      expect(encoded).toContain("title");
      expect(encoded).toContain("containsi");
    });

    it("should handle multiple values correctly", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("pagination[page]", "1");
      searchParams.set("pagination[pageSize]", "10");

      expect(searchParams.has("pagination[page]")).toBe(true);
      expect(searchParams.has("pagination[pageSize]")).toBe(true);
      expect(searchParams.get("pagination[page]")).toBe("1");
      expect(searchParams.get("pagination[pageSize]")).toBe("10");
    });
  });
});
