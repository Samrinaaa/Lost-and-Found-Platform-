const cloudinary = require("cloudinary").v2;
// Note: even in v1, the .v2 API is used — this is correct
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// For lost/found item images
const itemStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lostandfound/items",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit", quality: "auto" }],
  },
});

// For claim proof files
const proofStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lostandfound/proofs",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    resource_type: "auto",
  },
});

const uploadItem = multer({ storage: itemStorage });
const uploadProof = multer({ storage: proofStorage });

module.exports = { uploadItem, uploadProof };