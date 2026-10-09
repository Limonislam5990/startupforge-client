// Uploads an image file to imgbb and returns the public URL.
// Needs NEXT_PUBLIC_IMGBB_KEY in .env
export async function uploadToImgbb(file) {
  if (!process.env.NEXT_PUBLIC_IMGBB_KEY) throw new Error("Image upload is not configured.");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be smaller than 5 MB.");

  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.data?.url) throw new Error("Image upload failed. Please try again.");
  return data.data.url;
}
