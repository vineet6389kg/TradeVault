import cloudinary from "../config/cloudinary.js";

// sends an image (as a buffer in memory) to Cloudinary
// returns { secure_url, public_id, ... }
export const uploadImage = (
  buffer,
  folder = "tradevault/screenshots",
  options = {},
) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: "image", ...options },
        (error, result) => (error ? reject(error) : resolve(result)),
      )
      .end(buffer);
  });

// removes an image, so old files do not pile up in your free storage
export const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete failed:", error.message);
  }
};