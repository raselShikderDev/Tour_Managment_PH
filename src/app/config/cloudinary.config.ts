import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";


cloudinary.config({
    api_secreet: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    cloude_name: envVars.CLOUDINARY.CLOUDINARY_NAME,
})

export const deleteImageFromCloudinary = async (url:string) => {
    return url
}

export const cloudinaryUpload = cloudinary