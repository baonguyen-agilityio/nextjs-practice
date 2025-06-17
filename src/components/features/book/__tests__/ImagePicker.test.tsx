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
const mockRevokeObjectURL = jest.fn();

Object.defineProperty(global.URL, "createObjectURL", {
  writable: true,
  value: mockCreateObjectURL,
});

Object.defineProperty(global.URL, "revokeObjectURL", {
  writable: true,
  value: mockRevokeObjectURL,
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
    it("should render pick button", () => {
      render(<ImagePicker {...defaultProps} />);

      const pickButton = screen.getByTestId("pick-button");
      expect(pickButton).toBeInTheDocument();
      expect(pickButton).toHaveTextContent("Pick Image");
    });

    it("should render pick button with correct props", () => {
      render(<ImagePicker {...defaultProps} />);

      const pickButton = screen.getByTestId("pick-button");
      expect(pickButton).toHaveAttribute("data-variant", "flat");
      expect(pickButton).toHaveAttribute("data-color", "primary");
    });

    it("should render hidden file input", () => {
      render(<ImagePicker {...defaultProps} />);

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

    it("should display existing image when imageUrl is provided", () => {
      render(<ImagePicker {...defaultProps} imageUrl="/test-image.jpg" />);

      const previewImage = screen.getByTestId("preview-image");
      expect(previewImage).toBeInTheDocument();
      expect(previewImage).toHaveAttribute("src", "http://localhost:1337/test-image.jpg");
      expect(previewImage).toHaveAttribute("alt", "Preview");
      expect(previewImage).toHaveAttribute("width", "100");
      expect(previewImage).toHaveAttribute("height", "100");
      expect(screen.queryByText("No image selected.")).not.toBeInTheDocument();
    });
  });

  describe("File Selection", () => {
    it("should trigger file input when pick button is clicked", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      const clickSpy = jest.spyOn(fileInput, "click");

      const pickButton = screen.getByTestId("pick-button");
      fireEvent.click(pickButton);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it("should call onFileChange when file is selected", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      const testFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      expect(mockOnFileChange).toHaveBeenCalledTimes(1);
      expect(mockOnFileChange).toHaveBeenCalledWith(testFile);
    });

    it("should call onFileChange with null when no file is selected", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();

      fireEvent.change(fileInput, { target: { files: [] } });

      expect(mockOnFileChange).toHaveBeenCalledTimes(1);
      expect(mockOnFileChange).toHaveBeenCalledWith(null);
    });

    it("should create preview URL for selected file", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      const testFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(testFile);
    });

    it("should display preview image for selected file", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      const testFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      const previewImage = screen.getByTestId("preview-image");
      expect(previewImage).toBeInTheDocument();
      expect(previewImage).toHaveAttribute("src", "blob:mock-url");
      expect(screen.queryByText("No image selected.")).not.toBeInTheDocument();
    });
  });

  describe("Image Display Priority", () => {
    it("should prioritize preview URL over existing imageUrl", () => {
      const { rerender } = render(<ImagePicker {...defaultProps} imageUrl="/existing.jpg" />);

      expect(screen.getByTestId("preview-image")).toHaveAttribute(
        "src",
        "http://localhost:1337/existing.jpg"
      );

      const fileInput = getFileInput();
      const testFile = new File(["test"], "new.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      expect(screen.getByTestId("preview-image")).toHaveAttribute("src", "blob:mock-url");
    });

    it("should handle empty imageUrl gracefully", () => {
      render(<ImagePicker {...defaultProps} imageUrl="" />);

      expect(screen.getByText("No image selected.")).toBeInTheDocument();
      expect(screen.queryByTestId("preview-image")).not.toBeInTheDocument();
    });

    it("should construct full URL for relative imageUrl", () => {
      render(<ImagePicker {...defaultProps} imageUrl="/uploads/image.jpg" />);

      const previewImage = screen.getByTestId("preview-image");
      expect(previewImage).toHaveAttribute("src", "http://localhost:1337/uploads/image.jpg");
    });
  });

  describe("Environment Variable Handling", () => {
    it("should handle missing NEXT_PUBLIC_STRAPI_URL", () => {
      delete process.env.NEXT_PUBLIC_STRAPI_URL;

      render(<ImagePicker {...defaultProps} imageUrl="/test.jpg" />);

      const previewImage = screen.getByTestId("preview-image");
      expect(previewImage).toHaveAttribute("src", "undefined/test.jpg");
    });

    it("should use environment variable for base URL", () => {
      process.env.NEXT_PUBLIC_STRAPI_URL = "https://api.example.com";

      render(<ImagePicker {...defaultProps} imageUrl="/test.jpg" />);

      const previewImage = screen.getByTestId("preview-image");
      expect(previewImage).toHaveAttribute("src", "https://api.example.com/test.jpg");
    });
  });

  describe("Edge Cases", () => {
    it("should handle file input with no files", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();

      fireEvent.change(fileInput, { target: { files: null } });

      expect(mockOnFileChange).toHaveBeenCalledWith(null);
    });

    it("should handle multiple file selection (takes first file)", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      const file1 = new File(["test1"], "test1.jpg", { type: "image/jpeg" });
      const file2 = new File(["test2"], "test2.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [file1, file2] } });

      expect(mockOnFileChange).toHaveBeenCalledWith(file1);
      expect(mockCreateObjectURL).toHaveBeenCalledWith(file1);
    });

    it("should handle non-image files", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      const textFile = new File(["test"], "test.txt", { type: "text/plain" });

      fireEvent.change(fileInput, { target: { files: [textFile] } });

      expect(mockOnFileChange).toHaveBeenCalledWith(textFile);
      expect(mockCreateObjectURL).toHaveBeenCalledWith(textFile);
    });

    it("should handle very large file names", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      const longFileName = "a".repeat(255) + ".jpg";
      const testFile = new File(["test"], longFileName, { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      expect(mockOnFileChange).toHaveBeenCalledWith(testFile);
    });
  });

  describe("Component Layout", () => {
    it("should have proper container structure", () => {
      render(<ImagePicker {...defaultProps} />);

      const container = screen.getByTestId("pick-button").parentElement;
      expect(container).toHaveClass("flex", "flex-col", "gap-2");
    });

    it("should display elements in correct order", () => {
      render(<ImagePicker {...defaultProps} imageUrl="/test.jpg" />);

      const container = screen.getByTestId("pick-button").parentElement;
      const children = Array.from(container?.children || []);

      expect(children[0]).toBe(screen.getByTestId("preview-image"));
      expect(children[1]).toBe(getFileInput());
      expect(children[2]).toBe(screen.getByTestId("pick-button"));
    });

    it("should show no image message when no preview available", () => {
      render(<ImagePicker {...defaultProps} />);

      const message = screen.getByText("No image selected.");
      expect(message.tagName).toBe("P");
      expect(message).toHaveClass("text-gray-500");
    });
  });

  describe("Accessibility", () => {
    it("should have proper file input attributes", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      expect(fileInput).toHaveAttribute("accept", "image/*");
      expect(fileInput).toHaveAttribute("type", "file");
      expect(fileInput).toHaveAttribute("name", "image");
    });

    it("should have accessible button", () => {
      render(<ImagePicker {...defaultProps} />);

      const pickButton = screen.getByRole("button", { name: /pick image/i });
      expect(pickButton).toBeInTheDocument();
    });

    it("should have proper image alt text", () => {
      render(<ImagePicker {...defaultProps} imageUrl="/test.jpg" />);

      const previewImage = screen.getByTestId("preview-image");
      expect(previewImage).toHaveAttribute("alt", "Preview");
    });

    it("should handle keyboard navigation", () => {
      render(<ImagePicker {...defaultProps} />);

      const pickButton = screen.getByTestId("pick-button");
      const fileInput = getFileInput();

      pickButton.focus();
      expect(document.activeElement).toBe(pickButton);

      expect(fileInput).toHaveClass("hidden");
    });
  });

  describe("Performance", () => {
    it("should only call URL.createObjectURL when file is selected", () => {
      render(<ImagePicker {...defaultProps} />);

      expect(mockCreateObjectURL).not.toHaveBeenCalled();

      const fileInput = getFileInput();
      const testFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    });

    it("should handle rapid file changes", () => {
      render(<ImagePicker {...defaultProps} />);

      const fileInput = getFileInput();
      const file1 = new File(["test1"], "test1.jpg", { type: "image/jpeg" });
      const file2 = new File(["test2"], "test2.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [file1] } });
      fireEvent.change(fileInput, { target: { files: [file2] } });

      expect(mockOnFileChange).toHaveBeenCalledTimes(2);
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(2);
    });
  });

  describe("Props Validation", () => {
    it("should handle undefined onFileChange gracefully", () => {
      render(<ImagePicker imageUrl="" onFileChange={undefined as any} />);

      const fileInput = getFileInput();
      const testFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      expect(() => {
        fireEvent.change(fileInput, { target: { files: [testFile] } });
      }).not.toThrow();
    });

    it("should handle null imageUrl", () => {
      render(<ImagePicker imageUrl={null as any} onFileChange={mockOnFileChange} />);

      expect(screen.getByText("No image selected.")).toBeInTheDocument();
    });

    it("should handle function reference changes", () => {
      const newOnFileChange = jest.fn();
      const { rerender } = render(<ImagePicker {...defaultProps} />);

      rerender(<ImagePicker {...defaultProps} onFileChange={newOnFileChange} />);

      const fileInput = getFileInput();
      const testFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      expect(newOnFileChange).toHaveBeenCalledWith(testFile);
      expect(mockOnFileChange).not.toHaveBeenCalled();
    });
  });
});
