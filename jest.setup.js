// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Setup TextEncoder and TextDecoder for Jest environment
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (!global.fetch) {
  global.fetch = jest.fn();
}

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "/",
}));

// Create mock components
const MockButton = function MockButton({
  children,
  className,
  variant,
  color,
  size,
  onPress,
  onClick,
  disabled,
  isDisabled,
  isIconOnly,
  ...props
}) {
  return (
    <button
      className={className}
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-icon-only={isIconOnly}
      onClick={onPress || onClick}
      disabled={disabled || isDisabled}
      {...props}
    >
      {children}
    </button>
  );
};

const MockModal = function MockModal({ children, className, hideCloseButton, ...props }) {
  return (
    <div
      className={className}
      data-testid="modal"
      data-hide-close-button={hideCloseButton}
      {...props}
    >
      {children}
    </div>
  );
};

const MockSelect = function MockSelect({ children, className, classNames, ...props }) {
  return (
    <select className={className} data-classnames={JSON.stringify(classNames)} {...props}>
      {children}
    </select>
  );
};

// Mock HeroUI components
jest.mock("@heroui/react", () => {
  // Define extendVariants mock function
  const mockExtendVariants = jest.fn((component, config) => {
    // Return the original component with defaults applied
    const ExtendedComponent = (props) => {
      const mergedProps = { ...config?.defaultVariants, ...props };
      return component(mergedProps);
    };
    ExtendedComponent.displayName = component.displayName || component.name || "ExtendedComponent";
    return ExtendedComponent;
  });

  return {
    // Core components
    Card: function MockCard({ children, className, ...props }) {
      return (
        <div className={className} data-testid="card" {...props}>
          {children}
        </div>
      );
    },
    CardBody: function MockCardBody({ children, className, ...props }) {
      return (
        <div className={className} data-testid="card-body" {...props}>
          {children}
        </div>
      );
    },
    CardFooter: function MockCardFooter({ children, className, ...props }) {
      return (
        <div className={className} data-testid="card-footer" {...props}>
          {children}
        </div>
      );
    },
    Image: function MockImage({ alt, src, width, height, className, ...props }) {
      return (
        <img
          alt={alt}
          src={src}
          width={width}
          height={height}
          className={className}
          data-testid="hero-image"
          {...props}
        />
      );
    },
    Button: MockButton,
    Input: function MockInput({ className, label, ...props }) {
      const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
      return (
        <div>
          {label && <label htmlFor={inputId}>{label}</label>}
          <input id={inputId} className={className} label={label} {...props} />
        </div>
      );
    },
    Select: MockSelect,
    SelectItem: function MockSelectItem({ children, ...props }) {
      return <option {...props}>{children}</option>;
    },
    Modal: MockModal,
    ModalContent: function MockModalContent({ children, ...props }) {
      return (
        <div data-testid="modal-content" {...props}>
          {children}
        </div>
      );
    },
    ModalHeader: function MockModalHeader({ children, ...props }) {
      return (
        <div data-testid="modal-header" {...props}>
          {children}
        </div>
      );
    },
    ModalBody: function MockModalBody({ children, ...props }) {
      return (
        <div data-testid="modal-body" {...props}>
          {children}
        </div>
      );
    },
    ModalFooter: function MockModalFooter({ children, ...props }) {
      return (
        <div data-testid="modal-footer" {...props}>
          {children}
        </div>
      );
    },
    Skeleton: function MockSkeleton({ children, className, ...props }) {
      return (
        <div className={className} data-testid="skeleton" {...props}>
          {children}
        </div>
      );
    },
    // Utilities
    extendVariants: mockExtendVariants,
    useDisclosure: () => ({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
      onOpenChange: jest.fn(),
    }),
  };
});

// Mock icons
jest.mock("@/components/icons/MinusIcon", () => {
  return function MockMinusIcon({ className }) {
    return (
      <span data-testid="minus-icon" className={className}>
        -
      </span>
    );
  };
});

jest.mock("@/components/icons/PlusIcon", () => {
  return function MockPlusIcon({ className }) {
    return (
      <span data-testid="plus-icon" className={className}>
        +
      </span>
    );
  };
});

jest.mock("@/components/icons/ShoppingCartIcon", () => {
  return function MockShoppingCartIcon({ className }) {
    return (
      <span data-testid="shopping-cart-icon" className={className}>
        🛒
      </span>
    );
  };
});

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});
