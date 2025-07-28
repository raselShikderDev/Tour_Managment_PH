import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-") // empty space remove replace with dash
        .replace(/\./g, "-")
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-\.]/g, ""); // non alpha numeric - !@#$

        const fileExtension = file.originalname.split(".").pop()
        const uniqeFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "-" + "." + fileExtension
        return uniqeFileName
    },
  },
});

export const multerUpload = multer({storage:storage})
