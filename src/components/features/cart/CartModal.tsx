"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { OpenCart } from "./OpenCart";
import { formatUSD } from "@/utils/currency";
import type { CartItem } from "@/types";
import { useCart } from "@/hooks/useCart";
import { EditItemQuantityButton } from "./EditItemQuantityButton";

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <Button variant="light" data-hover="none" disableAnimation onPress={openCart}>
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
        onOpenChange={closeCart}
      >
        <ModalContent>
          {() => (
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
                      <div className="flex flex-col gap-1 justify-between">
                        <div className="flex flex-col gap-1">
                          <span>{item.book?.title}</span>
                          <span className=" font-inter font-bold text-[12px] text-gray-500">
                            {formatUSD(item.book?.price || 0)}
                          </span>
                        </div>
                        <Button variant="light" color="default" size="lg" fullWidth>
                          Remove
                        </Button>
                      </div>
                      <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                        <EditItemQuantityButton
                          item={item}
                          type="minus"
                          optimisticUpdate={updateCartItem}
                        />
                        <p className="w-6 text-center">
                          <span className="w-full text-sm">{item.quantity}</span>
                        </p>
                        <EditItemQuantityButton
                          item={item}
                          type="plus"
                          optimisticUpdate={updateCartItem}
                        />
                      </div>
                    </div>
                  ))}
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-between">
                  <span>Sub-Total</span>
                  <span className="font-bold font-inter">$100</span>
                </div>
                <Button fullWidth variant="solid" onPress={closeCart}>
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
