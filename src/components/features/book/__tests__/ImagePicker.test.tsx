import { render, screen, fireEvent } from "@testing-library/react";
import ImagePicker from "../ImagePicker";

const getFileInput = () => document.querySelector('input[type="file"]') as HTMLInputElement;

jest.mock("next/image", () => {
  return function MockImage({ src, alt, width, height }: any) {
    return <img src={src} alt={alt} width={width} height={height} data-testid="preview-image" />;
  };
});

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onPress, variant, color }: any) {
    return (
      <button onClick={onPress} data-testid="pick-button" data-variant={variant} data-color={color}>
        {children}
      </button>
    );
  },
}));

const mockCreateObjectURL = jest.fn();

Object.defineProperty(global.URL, "createObjectURL", {
  writable: true,
  value: mockCreateObjectURL,
});

describe("ImagePicker", () => {
  const mockOnFileChange = jest.fn();

  const defaultProps = {
    imageUrl: "",
    onFileChange: mockOnFileChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateObjectURL.mockReturnValue("blob:mock-url");
    process.env.NEXT_PUBLIC_STRAPI_URL = "http://localhost:1337";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_STRAPI_URL;
  });

  describe("Component Rendering", () => {
    it("should render pick button and file input with correct attributes", () => {
      render(<ImagePicker {...defaultProps} />);

      const pickButton = screen.getByTestId("pick-button");
      expect(pickButton).toBeInTheDocument();
      expect(pickButton).toHaveTextContent("Pick Image");
      expect(pickButton).toHaveAttribute("data-variant", "secondary");

      const fileInput = getFileInput();
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute("type", "file");
      expect(fileInput).toHaveAttribute("accept", "image/*");
      expect(fileInput).toHaveAttribute("name", "image");
      expect(fileInput).toHaveClass("hidden");
    });

    it("should show no image message when no image is provided", () => {
      render(<ImagePicker {...defaultProps} />);

      expect(screen.getByText("No image selected.")).toBeInTheDocument();
      expect(screen.queryByTestId("preview-image")).not.toBeInTheDocument();
    });

    it("should display existing image with correct URL", () => {
      render(<ImagePicker {...defaultProps} imageUrl="/test-image.jpg" />);

      const previewImage = screen.getByTestId("preview-image");
      expect(previewImage).toBeInTheDocument();
      expect(previewImage).toHaveAttribute("src", "http://localhost:1337/test-image.jpg");
      expect(previewImage).toHaveAttribute("alt", "Preview");
      expect(screen.queryByText("No image selected.")).not.toBeInTheDocument();
    });
  });

  describe("File Selection", () => {
    it("should trigger file input when pick button is clicked", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      const clickSpy = jest.spyOn(fileInput, "click");

      fireEvent.click(screen.getByTestId("pick-button"));
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it("should handle file selection and create preview", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      const testFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      expect(mockOnFileChange).toHaveBeenCalledTimes(1);
      expect(mockOnFileChange).toHaveBeenCalledWith(testFile);
      expect(mockCreateObjectURL).toHaveBeenCalledWith(testFile);

      const previewImage = screen.getByTestId("preview-image");
      expect(previewImage).toHaveAttribute("src", "blob:mock-url");
      expect(screen.queryByText("No image selected.")).not.toBeInTheDocument();
    });

    it("should handle no file selected", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      fireEvent.change(fileInput, { target: { files: [] } });

      expect(mockOnFileChange).toHaveBeenCalledWith(null);
    });
  });

  describe("Image Display Priority", () => {
    it("should prioritize preview URL over existing imageUrl", () => {
      render(<ImagePicker {...defaultProps} imageUrl="/existing.jpg" />);

      expect(screen.getByTestId("preview-image")).toHaveAttribute(
        "src",
        "http://localhost:1337/existing.jpg"
      );

      const fileInput = getFileInput();
      const testFile = new File(["test"], "new.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      expect(screen.getByTestId("preview-image")).toHaveAttribute("src", "blob:mock-url");
    });

    it("should handle missing environment variable", () => {
      delete process.env.NEXT_PUBLIC_STRAPI_URL;

      render(<ImagePicker {...defaultProps} imageUrl="/test.jpg" />);

      const previewImage = screen.getByTestId("preview-image");
      expect(previewImage).toHaveAttribute("src", "/test.jpg");
    });
  });
});
