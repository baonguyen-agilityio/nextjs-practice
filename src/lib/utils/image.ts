export async function uploadImage(image: File | null): Promise<string | null> {
  if (!image || image.size === 0) {
    return null;
  }

  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(image.type)) {
    throw new Error("Only JPG and PNG formats are allowed.");
  }

  const maxSizeMB = 2;
  if (image.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`Max image size is ${maxSizeMB}MB.`);
  }

  const uploadForm = new FormData();
  uploadForm.append("files", image);

  const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`, {
    method: "POST",
    body: uploadForm,
  });

  if (!uploadRes.ok) {
    throw new Error("Image upload failed.");
  }

  const uploaded = await uploadRes.json();
  return uploaded?.[0]?.id || null;
}
