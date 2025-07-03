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

export const ImageQuality = {
  HIGH: 90,
  STANDARD: 85,
  THUMBNAIL: 75,
  PLACEHOLDER: 30,
} as const;

export const ResponsiveSizes = {
  fullWidth: "(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw",

  hero: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",

  article: "(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 800px",

  cardGrid: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",

  twoColumn: "(max-width: 768px) 100vw, 50vw",

  threeColumn: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw",

  thumbnail: "(max-width: 640px) 50vw, (max-width: 768px) 25vw, 200px",

  avatar: "(max-width: 640px) 20vw, (max-width: 768px) 15vw, 100px",

  bookCover: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px",

  bookDetail: "(max-width: 768px) 100vw, 50vw",
} as const;
