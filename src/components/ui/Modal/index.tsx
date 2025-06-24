"use client";

import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { cn } from "@/utils";

export { ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure };

export const useModal = () => {
  const disclosure = useDisclosure();

  return {
    ...disclosure,
    openModal: disclosure.onOpen,
    closeModal: disclosure.onClose,
    toggleModal: disclosure.onOpenChange,
  };
};

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  description?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  color?: "default" | "primary" | "secondary";
  backdrop?: "opaque" | "blur" | "transparent";
  hideCloseButton?: boolean;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  placement?: "center" | "top" | "top-center" | "bottom" | "bottom-center";
  scrollBehavior?: "inside" | "outside" | "normal";
  className?: string;
  classNames?: {
    wrapper?: string;
    base?: string;
    backdrop?: string;
    header?: string;
    body?: string;
    footer?: string;
    closeButton?: string;
  };
}

const getColorClasses = (color: string) => {
  switch (color) {
    case "primary":
      return {
        base: "bg-white border border-primary/20",
        header: "border-primary/20 bg-primary text-white",
        footer: "border-primary/20 bg-primary/5",
      };
    case "secondary":
      return {
        base: "bg-white border border-secondary/20",
        header: "border-secondary/20 bg-secondary text-primary",
        footer: "border-secondary/20 bg-secondary/5",
      };
    default:
      return {
        base: "bg-white border border-gray-200",
        header: "border-gray-200 bg-white",
        footer: "border-gray-200 bg-gray-50",
      };
  }
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  hideCloseButton = false,
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  size = "md",
  color = "default",
  backdrop = "blur",
  placement = "center",
  scrollBehavior = "inside",
  className,
  classNames,
  description,
}) => {
  const colorClasses = getColorClasses(color);

  return (
    <HeroModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton={hideCloseButton}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      size={size}
      backdrop={backdrop}
      placement={placement}
      scrollBehavior={scrollBehavior}
      className={cn(colorClasses.base, className)}
      classNames={{
        ...classNames,
        header: cn(colorClasses.header, classNames?.header),
        footer: cn(colorClasses.footer, classNames?.footer),
      }}
    >
      <ModalContent>
        {() => (
          <>
            {title && (
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold">
                {title}
                {description && <p className="text-sm text-gray-500">{description}</p>}
              </ModalHeader>
            )}
            <ModalBody className="font-cardo">{children}</ModalBody>
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </>
        )}
      </ModalContent>
    </HeroModal>
  );
};

export const ModalComponent = Modal;
