"use client";

import { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/ui/Button";
import { Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { OpenCart } from "./OpenCart";
import { formatUSD } from "@/utils/currency";
import type { CartItem } from "@/types";
import { useCart } from "@/hooks/useCart";
import { EditItemQuantityButton } from "./EditItemQuantityButton";
import { createCart } from "@/services/cart";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { DeleteItemButton } from "./DeleteItemButton";
import { createImageUrl } from "@/utils";

interface CartModalProps {
  onCreateCart?: () => void;
}

export default function CartModal({ onCreateCart }: CartModalProps = {}) {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const handleCreateCart = useCallback(() => {
    if (onCreateCart) {
      onCreateCart();
    } else {
      createCart();
    }
  }, [onCreateCart]);

  useEffect(() => {
    if (!cart || cart.cartItems.length === 0) {
      handleCreateCart();
    }
  }, [cart, handleCreateCart]);

  const totalAmount = cart?.cost?.totalAmount || 0;
  const formattedTotal = formatUSD(totalAmount);

  const renderEmptyCart = () => (
    <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
      <ShoppingCartIcon className="h-16" />
      <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
    </div>
  );

  const renderCartItem = (item: CartItem) => {
    const imageUrl = createImageUrl(item.book?.imageUrl || "");
    const itemPrice = formatUSD(item.book?.price || 0);

    return (
      <div key={item.documentId} className="flex gap-2">
        <Image src={imageUrl} alt={item.book?.title} width={100} />
        <div className="flex flex-col gap-1 justify-between">
          <div className="flex flex-col gap-1">
            <span>{item.book?.title}</span>
            <span className="font-inter font-bold text-[12px] text-gray-500">{itemPrice}</span>
          </div>
          <DeleteItemButton item={item} optimisticUpdate={updateCartItem} />
        </div>
        <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
          <EditItemQuantityButton item={item} type="minus" optimisticUpdate={updateCartItem} />
          <p className="w-6 text-center">
            <span className="w-full text-sm">{item.quantity}</span>
          </p>
          <EditItemQuantityButton item={item} type="plus" optimisticUpdate={updateCartItem} />
        </div>
      </div>
    );
  };

  const renderCartItems = () => {
    if (!cart || cart.cartItems.length === 0) {
      return renderEmptyCart();
    }

    return cart!.cartItems.map(renderCartItem);
  };

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
                <div key={cart?.id} className="flex flex-col gap-2 overflow-y-auto">
                  {renderCartItems()}
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-between">
                  <span>Sub-Total</span>
                  <span className="font-bold font-inter">{formattedTotal}</span>
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
