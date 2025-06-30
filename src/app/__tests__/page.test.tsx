import { redirect } from "next/navigation";
import Home from "../page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect to /books", () => {
    const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

    Home();

    expect(mockRedirect).toHaveBeenCalledWith("/books");
    expect(mockRedirect).toHaveBeenCalledTimes(1);
  });
});
