"use client";

import { Button } from "@/components/ui/Button";
import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { OpenCart } from "./OpenCart";
import { formatUSD } from "@/utils/currency";
import type { Cart, CartItem } from "@/types";

export default function CartModal({ cart }: { cart: Cart | undefined }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button variant="light" data-hover="none" disableAnimation onPress={onOpen}>
        <OpenCart quantity={cart?.totalQuantity} />
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
              <ModalBody>
                {cart &&
                  cart.cartItems.map((item: CartItem) => (
                    <div key={item.book?.slug} className="flex gap-2">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item.book?.imageUrl}`}
                        alt={item.book?.title}
                        width={100}
                      />
                      <div className="flex flex-col gap-1">
                        <span>{item.book?.title}</span>
                        <span className=" font-inter font-bold text-[12px] text-gray-500">
                          {formatUSD(item.book?.price || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
              </ModalBody>
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
