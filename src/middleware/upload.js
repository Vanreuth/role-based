const express = require("express");
const multer = require("multer");
const path = require("path");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const router = express.Router();

// Configure Cloudflare R2
const s3 = new S3Client({
  region: "auto", // R2 doesn’t need a region
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

// Multer configuration
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Upload single image to R2
const uploadToR2 = async (file, folder = "products") => {
  const params = {
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
    Key: `${folder}/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const uploader = new Upload({ client: s3, params });
  await uploader.done();

  // Works only if bucket is public or bound to domain
  return `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.CLOUDFLARE_BUCKET_NAME}/${params.Key}`;
};

// Upload avatar image
const uploadAvatarToR2 = async (file) => uploadToR2(file, "avatars");

// Upload multiple images
const uploadMultipleToR2 = async (files, folder = "products") =>
  Promise.all(files.map((file) => uploadToR2(file, folder)));

module.exports = {
  upload,
  uploadToR2,
  uploadMultipleToR2,
  uploadAvatarToR2,
};
