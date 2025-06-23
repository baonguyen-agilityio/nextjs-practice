"use client";

import { useEffect, useState, useCallback, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { OpenCart } from "./OpenCart";
import { formatUSD } from "@/utils/currency";
import type { CartItem } from "@/types";
import { useCart } from "@/hooks/useCart";
import { EditItemQuantityButton } from "./EditItemQuantityButton";
import { createCart } from "@/services/cart";
import ShoppingCartIcon from "@/components/icons/ShoppingCartIcon";
import { DeleteItemButton } from "./DeleteItemButton";
import { createImageUrl } from "@/utils";

interface CartModalProps {
  onCreateCart?: () => void;
}

export default function CartModal({ onCreateCart }: CartModalProps = {}) {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const openCart = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }, 100);
  }, []);

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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeCart]);

  const totalAmount = cart?.cost?.totalAmount || 0;
  const formattedTotal = formatUSD(totalAmount);
  const cartItemCount = cart?.cartItems?.length || 0;

  const renderEmptyCart = () => (
    <div
      className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <ShoppingCartIcon className="h-16" aria-hidden="true" />
      <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
    </div>
  );

  const renderCartItem = (item: CartItem) => {
    const imageUrl = createImageUrl(item.book?.imageUrl || "");
    const itemPrice = formatUSD(item.book?.price || 0);

    return (
      <article
        key={item.documentId}
        className="flex gap-2"
        aria-labelledby={`cart-item-title-${item.documentId}`}
        aria-describedby={`cart-item-price-${item.documentId} cart-item-quantity-${item.documentId}`}
      >
        <Image src={imageUrl} alt={`Cover of ${item.book?.title}`} width={100} role="img" />
        <div className="flex flex-col gap-1 justify-between">
          <div className="flex flex-col gap-1">
            <h4 id={`cart-item-title-${item.documentId}`} className="text-sm font-medium">
              {item.book?.title}
            </h4>
            <span
              id={`cart-item-price-${item.documentId}`}
              className="font-inter font-bold text-[12px] text-gray-500"
              aria-label={`Price: ${itemPrice}`}
            >
              {itemPrice}
            </span>
          </div>
          <DeleteItemButton item={item} optimisticUpdate={updateCartItem} />
        </div>
        <div
          className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700"
          role="group"
          aria-label={`Quantity controls for ${item.book?.title}`}
        >
          <EditItemQuantityButton item={item} type="minus" optimisticUpdate={updateCartItem} />
          <div
            id={`cart-item-quantity-${item.documentId}`}
            className="w-6 text-center"
            role="status"
            aria-live="polite"
            aria-label={`Current quantity: ${item.quantity}`}
          >
            <span className="w-full text-sm">{item.quantity}</span>
          </div>
          <EditItemQuantityButton item={item} type="plus" optimisticUpdate={updateCartItem} />
        </div>
      </article>
    );
  };

  const renderCartItems = () => {
    if (!cart || cart.cartItems.length === 0) {
      return renderEmptyCart();
    }

    return (
      <div role="region" aria-label="Shopping cart items">
        {cart!.cartItems.map(renderCartItem)}
      </div>
    );
  };

  return (
    <>
      <Button
        variant="light"
        data-hover="none"
        disableAnimation
        onPress={openCart}
        aria-label={`Open shopping cart with ${cart?.totalQuantity || 0} items`}
        aria-describedby="cart-status"
      >
        <OpenCart quantity={cart?.totalQuantity} />
      </Button>

      <div id="cart-status" className="sr-only">
        {cart?.totalQuantity ? `${cart.totalQuantity} items in cart` : "Cart is empty"}
      </div>

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
        aria-describedby="cart-modal-description"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 id="cart-modal-title">Your Cart</h2>
                <p id="cart-modal-description" className="text-sm font-normal">
                  {cartItemCount === 0
                    ? "Your shopping cart is empty"
                    : `You have ${cartItemCount} item${cartItemCount !== 1 ? "s" : ""} in your cart`}
                </p>
              </ModalHeader>
              <ModalBody>
                <div key={cart?.id} className="flex flex-col gap-2 overflow-y-auto" role="main">
                  {renderCartItems()}
                </div>
              </ModalBody>
              <ModalFooter>
                <div
                  className="flex justify-between w-full"
                  role="contentinfo"
                  aria-label="Cart total"
                >
                  <span>Sub-Total</span>
                  <span
                    className="font-bold font-inter"
                    aria-label={`Total amount: ${formattedTotal}`}
                  >
                    {formattedTotal}
                  </span>
                </div>
                <Button fullWidth variant="solid" onPress={closeCart} aria-label="Close cart modal">
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
