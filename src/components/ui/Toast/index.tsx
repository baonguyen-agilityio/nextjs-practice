import { extendVariants, Toast as HeroToast } from "@heroui/react";

export const Toast = extendVariants(HeroToast, {
  variants: {
    color: {
      default: {
        base: "bg-background border border-default-200",
      },
      success: {
        base: "bg-success-50 border border-success-200 text-success-800",
      },
      warning: {
        base: "bg-warning-50 border border-warning-200 text-warning-800",
      },
      danger: {
        base: "bg-danger-50 border border-danger-200 text-danger-800",
      },
    },
  },
  defaultVariants: {
    placement: "top-right",
    color: "default",
    isDismissible: true,
    isClosable: true,
  },
});

export const AccessibleToast: React.FC<
  React.ComponentProps<typeof Toast> & {
    role?: string;
    "aria-live"?: "polite" | "assertive" | "off";
    "aria-atomic"?: boolean;
  }
> = ({
  role = "alert",
  "aria-live": ariaLive = "assertive",
  "aria-atomic": ariaAtomic = true,
  ...props
}) => {
  return (
    <Toast
      {...props}
      className={`${props.className || ""}`}
      role={role}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
    />
  );
};
