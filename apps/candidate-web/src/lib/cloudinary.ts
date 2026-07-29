export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
    process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error(
      "Cloudinary Cloud Name is missing in .env (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_CLOUD_NAME)",
    );
  }
  if (!uploadPreset) {
    throw new Error(
      "Cloudinary Upload Preset is missing in .env (NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET or VITE_CLOUDINARY_UPLOAD_PRESET)",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // Use 'auto' so Cloudinary grants public delivery access
  const resourceType = "auto";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Cloudinary upload error:", errorData);
    throw new Error(
      errorData?.error?.message || "Failed to upload file to Cloudinary",
    );
  }

  const data = await res.json();
  return data.secure_url;
};
