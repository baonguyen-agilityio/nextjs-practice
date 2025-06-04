import type { APIResponse, BookModel } from "@/types";

export type CartItemModel = {
  quantity: number;
  book: {
    data: APIResponse<BookModel>;
  };
  imageUrl: string;
};

type CartItemResponse = APIResponse<CartItemModel>;

type CartModel = {
  cart_items: { data: CartItemResponse[] };
};

export type Card = {
  cartItems: CartItemModel[];
  totalQuantity: number;
  error?: string | null;
};

export type CartDataResponse = Promise<Card>;

export type CartResponse = {
  data: APIResponse<CartModel>[];
};
