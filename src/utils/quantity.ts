import { MIN_QUANTITY } from "@/constants";

export const validateQuantity = (value: number): number => {
  if (isNaN(value) || !isFinite(value) || value < 0) {
    return MIN_QUANTITY;
  }

  const intValue = Math.floor(value);
  return Math.max(MIN_QUANTITY, intValue);
};

export const sanitizeQuantityInput = (value: string): string => {
  return value.replace(/[^\d]/g, "");
};
