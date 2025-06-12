export const uploadToCloudinary = async (file: File): Promise<string> => {
  const url = "cloudinary://464372825347451:N2C8PM7_8wgrNaR9BaEe14brrSY@dl7l8o0d6";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "<TU_UPLOAD_PRESET>");

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al subir imagen a Cloudinary");

  const data = await res.json();
  return data.secure_url as string;
};