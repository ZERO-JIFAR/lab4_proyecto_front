export const uploadToCloudinary = async (file: File): Promise<string> => {
  const url = "https://api.cloudinary.com/v1_1/dl7l8o0d6/image/upload";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "nikeCloud");

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al subir imagen a Cloudinary");

  const data = await res.json();
  return data.secure_url as string;
};