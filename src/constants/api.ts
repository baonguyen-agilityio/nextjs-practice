export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
export const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN;
export const DOMAIN = process.env.DOMAIN;
export const API_ENDPOINTS = {
  AUTH: "/auth/local",
  BOOKS: "/books",
  CART: "/carts",
};

export const API_ROUTE_ENDPOINT = {
  LOGIN: "/api/auth/login",
  BOOKS: "/api/books",
  CART: "/api/cart",
};
