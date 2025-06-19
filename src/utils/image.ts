export const createImageUrl = (url: string) => {
  if (url.startsWith("http")) return url;

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!baseUrl || baseUrl === "undefined") {
    return url.startsWith("/") ? url : `/${url}`;
  }

  return `${baseUrl}${url}`;
};

export const createImageUrlFromId = (id: string) => {
  return `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/${id}`;
};
