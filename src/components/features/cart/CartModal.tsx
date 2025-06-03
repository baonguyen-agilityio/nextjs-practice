"use client";

import { Button } from "@/components/ui/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { OpenCart } from "./OpenCart";

export default function CartModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button variant="light" data-hover="none" disableAnimation onPress={onOpen}>
        <OpenCart quantity={1} />
      </Button>
      <Modal
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-primary/90 backdrop-opacity-40",
          base: "text-primary",
          header: "bg-secondary text-primary",
          footer: "flex flex-col gap-4",
          closeButton: "text-primary hover:bg-white/5 active:bg-white/10 top-3 right-2",
        }}
        isOpen={isOpen}
        radius="lg"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Your Cart</ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter>
                <div className="flex justify-between">
                  <span>Sub-Total</span>
                  <span className="font-bold font-inter">$100</span>
                </div>
                <Button fullWidth variant="solid" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
