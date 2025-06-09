"use client";

import React, { createContext, use, useContext, useMemo, useOptimistic } from "react";
import type { Book, Cart, CartItem } from "@/types";

type CartContextType = {
  cart: Cart | undefined;
  addCartItem: (book: Book, quantity: number) => void;
  updateCartItem: (bookId: string, updateType: UpdateType) => void;
};

type UpdateType = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { bookId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { book: Book; quantity: number };
    };

const CartContext = createContext<CartContextType | undefined>(undefined);

function createEmptyCart(): Cart {
  return {
    id: "",
    totalQuantity: 0,
    cartItems: [],
    error: null,
  };
}

function calculateItemCost(quantity: number, price: number): number {
  return price * quantity;
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  book: Book,
  quantity: number
): CartItem {
  const sumQuantity = existingItem ? existingItem.quantity + quantity : quantity;
  const totalAmount = calculateItemCost(quantity, book.price);

  return {
    id: existingItem?.id || "",
    quantity: sumQuantity,
    book,
    totalAmount: totalAmount,
  };
}

function updateCartTotals(cartItems: CartItem[]): Pick<Cart, "totalQuantity"> {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    totalQuantity,
  };
}

function updateCartItem(item: CartItem, updateType: UpdateType): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity = updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = item.book.price;
  const newTotalAmount = calculateItemCost(newQuantity, singleItemAmount);

  return {
    ...item,
    quantity: newQuantity,
    totalAmount: newTotalAmount,
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();
  switch (action.type) {
    case "ADD_ITEM": {
      const { book, quantity } = action.payload;
      const existingItem = currentCart.cartItems.find((item) => item.book.id === book.id);
      const updatedItem = createOrUpdateCartItem(existingItem, book, quantity);

      const updatedCartItems = existingItem
        ? currentCart.cartItems.map((item) => (item.book.id === book.id ? updatedItem : item))
        : [...currentCart.cartItems, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedCartItems),
        cartItems: updatedCartItems,
      };
    }
    case "UPDATE_ITEM": {
      const { bookId, updateType } = action.payload;
      const updatedCartItems = currentCart.cartItems
        .map((item) => (item.book.id === bookId ? updateCartItem(item, updateType) : item))
        .filter(Boolean) as CartItem[];

      if (updatedCartItems.length === 0) {
        return {
          ...currentCart,
          cartItems: [],
          totalQuantity: 0,
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedCartItems),
        cartItems: updatedCartItems,
      };
    }
    default: {
      return currentCart;
    }
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(initialCart, cartReducer);

  const addCartItem = (book: Book, quantity: number) => {
    updateOptimisticCart({ type: "ADD_ITEM", payload: { book, quantity } });
  };

  const updateCartItem = (bookId: string, updateType: UpdateType) => {
    updateOptimisticCart({ type: "UPDATE_ITEM", payload: { bookId, updateType } });
  };

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      addCartItem,
      updateCartItem,
    }),
    [optimisticCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
