"use client";

import { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/ui/Button";
import { Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { OpenCart } from "./OpenCart";
import { formatUSD } from "@/utils/currency";
import type { CartItem, Cart } from "@/types";
import { useCart } from "@/hooks/useCart";
import { EditItemQuantityButton } from "./EditItemQuantityButton";
import { createCart } from "@/services/cart";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { DeleteItemButton } from "./DeleteItemButton";

export const MODAL_TITLE = "Your Cart";
export const EMPTY_CART_MESSAGE = "Your cart is empty.";
export const SUBTOTAL_LABEL = "Sub-Total";
export const CLOSE_BUTTON_TEXT = "Close";

export const createImageUrl = (baseUrl: string | undefined, imageUrl: string): string => {
  return `${baseUrl || ""}${imageUrl}`;
};

export const isCartEmpty = (cart: Cart | null | undefined): boolean => {
  return !cart || cart.cartItems.length === 0;
};

export const formatPrice = (price: number): string => {
  return formatUSD(price || 0);
};

export const getTotalAmount = (cart: Cart | null | undefined): number => {
  return cart?.cost?.totalAmount || 0;
};

export const getModalClassNames = () => ({
  body: "py-6",
  backdrop: "bg-primary/90 backdrop-opacity-40",
  base: "text-primary",
  header: "bg-secondary text-primary",
  footer: "flex flex-col gap-4",
  closeButton: "text-primary hover:bg-white/5 active:bg-white/10 top-3 right-2",
});

export const getEmptyCartStyles = (): string => {
  return "mt-20 flex w-full flex-col items-center justify-center overflow-hidden";
};

export const getQuantityControlsStyles = (): string => {
  return "ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700";
};

interface CartModalProps {
  onCreateCart?: () => void;
  baseImageUrl?: string;
}

export default function CartModal({ onCreateCart, baseImageUrl }: CartModalProps = {}) {
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
    if (isCartEmpty(cart)) {
      handleCreateCart();
    }
  }, [cart, handleCreateCart]);

  const modalClassNames = getModalClassNames();
  const emptyCartStyles = getEmptyCartStyles();
  const quantityControlsStyles = getQuantityControlsStyles();
  const totalAmount = getTotalAmount(cart);
  const formattedTotal = formatPrice(totalAmount);

  const renderEmptyCart = () => (
    <div className={emptyCartStyles}>
      <ShoppingCartIcon className="h-16" />
      <p className="mt-6 text-center text-2xl font-bold">{EMPTY_CART_MESSAGE}</p>
    </div>
  );

  const renderCartItem = (item: CartItem) => {
    const imageUrl = createImageUrl(
      baseImageUrl || process.env.NEXT_PUBLIC_STRAPI_URL,
      item.book?.imageUrl || ""
    );
    const itemPrice = formatPrice(item.book?.price || 0);

    return (
      <div key={item.book?.slug} className="flex gap-2">
        <Image src={imageUrl} alt={item.book?.title} width={100} />
        <div className="flex flex-col gap-1 justify-between">
          <div className="flex flex-col gap-1">
            <span>{item.book?.title}</span>
            <span className="font-inter font-bold text-[12px] text-gray-500">{itemPrice}</span>
          </div>
          <DeleteItemButton item={item} optimisticUpdate={updateCartItem} />
        </div>
        <div className={quantityControlsStyles}>
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
    if (isCartEmpty(cart)) {
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
        classNames={modalClassNames}
        isOpen={isOpen}
        radius="lg"
        onOpenChange={closeCart}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">{MODAL_TITLE}</ModalHeader>
              <ModalBody>{renderCartItems()}</ModalBody>
              <ModalFooter>
                <div className="flex justify-between">
                  <span>{SUBTOTAL_LABEL}</span>
                  <span className="font-bold font-inter">{formattedTotal}</span>
                </div>
                <Button fullWidth variant="solid" onPress={closeCart}>
                  {CLOSE_BUTTON_TEXT}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
