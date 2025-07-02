"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { OpenCart } from "./OpenCart";
import { formatUSD } from "@/utils/currency";
import type { CartItem } from "@/types";
import { useCart } from "@/hooks/useCart";
import { EditItemQuantityButton } from "./EditItemQuantityButton";
import { createCart } from "@/services/cart";
import ShoppingCartIcon from "@/components/icons/ShoppingCartIcon";
import { DeleteItemButton } from "./DeleteItemButton";
import { createImageUrl } from "@/utils";
import { Modal, useModal } from "@/components/ui/Modal";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const { isOpen, onOpen, onClose, onOpenChange } = useModal();

  useEffect(() => {
    if (!cart || cart.cartItems.length === 0) {
      createCart();
    }
  }, [cart]);

  const totalAmount = cart?.cost?.totalAmount || 0;
  const formattedTotal = formatUSD(totalAmount);

  const renderEmptyCart = () => (
    <div
      className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <ShoppingCartIcon className="w-10 h-10" aria-hidden="true" />
      <p className="mt-6 text-center text-lg font-bold">Your cart is empty.</p>
    </div>
  );

  const renderCartItem = (item: CartItem, index: number) => {
    const imageUrl = createImageUrl(item.book?.imageUrl || "");
    const itemPrice = formatUSD(item.book?.price || 0);

    return (
      <article
        key={item.documentId || `cart-item-${index}`}
        className="flex gap-2"
        aria-labelledby={`cart-item-title-${item.documentId}`}
        aria-describedby={`cart-item-price-${item.documentId} cart-item-quantity-${item.documentId}`}
      >
        <div className="flex-shrink-0 w-[80px] h-[120px] flex items-center justify-center">
          <ImageWithFallback
            src={imageUrl}
            alt={`Cover of ${item.book?.title}`}
            width={80}
            height={120}
            className="max-w-full max-h-full object-contain"
            fallbackText="Book"
          />
        </div>
        <div className="flex flex-col gap-1 justify-between">
          <div className="flex flex-col gap-1">
            <h3 id={`cart-item-title-${item.documentId}`} className="text-sm font-bold font-inter">
              {item.book?.title}
            </h3>
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
        <div className="flex flex-col gap-2 border-b border-neutral-200 dark:border-neutral-700 pb-4">
          {cart!.cartItems.map((item, index) => renderCartItem(item, index))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Button
        variant="text"
        data-hover="none"
        disableAnimation
        onPress={onOpen}
        aria-label={`Open shopping cart with ${cart?.totalQuantity || 0} items`}
        aria-describedby="cart-status"
        className="bg-transparent"
      >
        <OpenCart quantity={cart?.totalQuantity} />
      </Button>

      <div id="cart-status" className="sr-only">
        {cart?.totalQuantity ? `${cart.totalQuantity} items in cart` : "Cart is empty"}
      </div>

      <Modal
        isOpen={isOpen}
        radius="lg"
        onClose={onClose}
        onOpenChange={onOpenChange}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
        aria-describedby="cart-modal-description"
        title="Your Cart"
        footer={
          <div className="flex flex-col gap-4 p-4 pt-0 w-full">
            <div
              className="flex justify-between w-full font-inter"
              role="group"
              aria-label="Cart total"
            >
              <span>Subtotal</span>
              <span className="font-bold font-inter" aria-label={`Total amount: ${formattedTotal}`}>
                {formattedTotal} USD
              </span>
            </div>
            <Button fullWidth variant="secondary" onPress={onClose} aria-label="Checkout">
              Continue To Checkout
            </Button>
          </div>
        }
      >
        <div key={cart?.id} className="flex flex-col gap-2 overflow-y-auto">
          {renderCartItems()}
        </div>
      </Modal>
    </>
  );
}
