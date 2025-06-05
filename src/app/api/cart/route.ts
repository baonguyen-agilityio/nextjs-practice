import { API_ENDPOINTS } from "@/constants/api";
import { withAuth } from "@/hocs/withAuth";
import { apiClient } from "@/services/api";
import type { CartItem, CartItemStrapiResponse, CartStrapiResponse } from "@/types";

export const GET = withAuth(async (req: Request, token: string) => {
  const url = new URL(req.url);
  url.searchParams.set("populate[cart_items][populate][book][populate]", "image");
  const res = await apiClient.get<CartStrapiResponse>(
    `${API_ENDPOINTS.CART}?${decodeURIComponent(url.searchParams.toString())}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return Response.json(res);
});

export const POST = withAuth(async (req: Request, token: string) => {
  const searchParams = new URLSearchParams({
    "populate[book][populate]": "image",
  });
  const data = await req.json();

  const { cart, book, quantity } = data.data;

  const query = new URLSearchParams({
    "filters[cart][id][$eq]": cart,
    "filters[book][id][$eq]": book,
    "populate[book][populate]": "image",
  });

  const existingRes = await apiClient.get<{ data: CartItem[] }>(
    `${API_ENDPOINTS.CART_ITEMS}?${decodeURIComponent(query.toString())}`,
    { headers: { Authorization: token } }
  );

  const existingItem = existingRes.data?.[0];

  try {
    let result;
    if (existingItem) {
      const updatedQuantity = existingItem.quantity + quantity;

      result = await apiClient.put<{
        data: CartItemStrapiResponse;
        error?: string;
      }>(
        `${API_ENDPOINTS.CART_ITEMS}/${existingItem.documentId}?${decodeURIComponent(searchParams.toString())}`,
        {
          body: {
            data: {
              quantity: updatedQuantity,
            },
          },
          headers: { Authorization: token },
        }
      );
      if (result.error) {
        const { error } = JSON.parse(result.error) as {
          error: {
            status: number;
            message: string;
          };
        };

        return new Response(JSON.stringify({ error: error.message }), {
          status: error.status,
        });
      }
    } else {
      result = await apiClient.post<{
        data: CartItemStrapiResponse;
        error?: string;
      }>(`${API_ENDPOINTS.CART_ITEMS}?${decodeURIComponent(searchParams.toString())}`, {
        body: data,
        headers: {
          Authorization: token,
        },
      });
      if (result.error) {
        const { error } = JSON.parse(result.error) as {
          error: {
            status: number;
            message: string;
          };
        };

        return new Response(JSON.stringify({ error: error.message }), {
          status: error.status,
        });
      }
    }

    return Response.json(result);
  } catch (error) {
    console.log("error", error);
    return new Response(JSON.stringify({ error: "Failed to add cart item." }), {
      status: 500,
    });
  }
});
