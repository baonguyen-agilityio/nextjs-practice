export const createImageUrl = (url: string) => {
  return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
};

export const createImageUrlFromId = (id: string) => {
  return `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/${id}`;
};
