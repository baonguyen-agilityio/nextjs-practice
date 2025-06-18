import { MIN_QUANTITY, MAX_QUANTITY } from "@/constants";

export const validateQuantity = (value: number): number => {
  return Math.max(MIN_QUANTITY, Math.min(value, MAX_QUANTITY));
};
