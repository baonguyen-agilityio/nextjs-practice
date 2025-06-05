import type { Book, BookStrapiModel } from "@/types";

export type CartItemStrapiModel = {
  id: string;
  quantity: number;
  book: BookStrapiModel;
};

export type CartStrapiModel = {
  id: string;
  cart_items: CartItemStrapiModel[];
};

export type CartStrapiResponse = {
  data: CartStrapiModel[];
};

export type CartItemStrapiResponse = {
  data: CartItemStrapiModel;
};

export type CartItem = {
  id: string;
  quantity: number;
  book: Book | null;
  error?: string | null;
  documentId?: string;
};

export type Cart = {
  id: string;
  cartItems: CartItem[];
  totalQuantity: number;
  error?: string | null;
};

export type CartItemPayload = {
  bookId: string;
  quantity: number;
  cartId: string;
};
