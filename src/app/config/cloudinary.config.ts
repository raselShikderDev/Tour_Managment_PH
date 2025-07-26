import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import appError from "../errorHelper/appError";
import { StatusCodes } from "http-status-codes";

cloudinary.config({
  api_secreet: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  cloude_name: envVars.CLOUDINARY.CLOUDINARY_NAME,
});

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    //https://res.cloudinary.com/dhht37fgc/image/upload/v1753497516/y2fb23kzi2r-1753497515497-forest-jpg-.jpg.jpg
  const regex = /v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

  const match = url.match(regex);

  if (match && match[1]) {
    const public_id = match[1];
    await cloudinary.uploader.destroy(public_id);
    // eslint-disable-next-line no-console
    console.log("File ", +public_id + " Removed from the cloudinary");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    throw new appError(StatusCodes.UNAUTHORIZED, "Faild to delete image in cloudinary", error.message)
  }
};

export const cloudinaryUpload = cloudinary;
