const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const path = require ('path');

// Configure AWS
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
// Multer configuration for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only!')
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload single image to S3
const uploadToS3 = async (file, folder = 'products') => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `avatars/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  const upload = new Upload({
    client: s3,
    params: params
  });
  
  const result = await upload.done();
  return result.Location;
};
// Upload avatar image to S3
const uploadAvatarToS3 = async (file) => {
  return await uploadToS3(file, 'avatars');
};
// Upload multiple images to S3
const uploadMultipleToS3 = async (files, folder = 'products') => {
  const uploadPromises = files.map(file => uploadToS3(file, folder));
  return await Promise.all(uploadPromises);
};

module.exports = {
  upload,
  uploadToS3,
  uploadMultipleToS3,
  uploadAvatarToS3
};
