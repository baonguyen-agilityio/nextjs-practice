/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { ModalProps as HeroModalProps } from "@heroui/react";
import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  extendVariants,
} from "@heroui/react";
import { Button } from "../Button";
import CloseIcon from "@/components/icons/close-icon";

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

const StyledModal = extendVariants(HeroModal, {
  defaultVariants: {
    color: "default",
    size: "md",
    backdrop: "blur",
    placement: "center",
    scrollBehavior: "inside",
  },
});

export interface ModalProps extends HeroModalProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, children, footer, ...props }) => {
  const { ref, ...restProps } = props;
  const modalId = `modal-${Math.random().toString(36).substr(2, 9)}`;
  const titleId = `${modalId}-title`;
  const descriptionId = `${modalId}-description`;

  return (
    <StyledModal
      hideCloseButton
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={descriptionId}
      {...restProps}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {title && (
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold font-cardo bg-secondary text-primary">
                <div className="flex justify-between items-center">
                  <h2 id={titleId}>{title}</h2>
                  <Button
                    variant="text"
                    isIconOnly
                    radius="full"
                    size="sm"
                    onPress={onClose}
                    className="data-[hover]:text-primary"
                    aria-label="Close dialog"
                  >
                    <CloseIcon aria-hidden="true" />
                  </Button>
                </div>
              </ModalHeader>
            )}
            <ModalBody className="p-4 pt-5">
              <div id={descriptionId}>{children}</div>
            </ModalBody>
            {footer && (
              <ModalFooter role="group" aria-label="Dialog actions">
                {footer}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </StyledModal>
  );
};
