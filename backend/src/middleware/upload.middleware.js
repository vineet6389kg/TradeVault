import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // keeps the file in memory, we send it to Cloudinary
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// wraps multer so upload errors come back as clean JSON messages
export const uploadScreenshot = (req, res, next) => {
  upload.single("screenshot")(req, res, (error) => {
    if (!error) return next();

    const message =
      error.code === "LIMIT_FILE_SIZE" ? "Image must be under 5 MB" : error.message;
    res.status(400).json({ message });
  });
};