/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { IDvision } from "./division.interface";
import { divisionModel } from "./division.model";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

// Creating Division
const createDivision = async (payload: IDvision) => {
  if (!payload)
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Division's infromation not found"
    );

  // // This part handled by pre hook in model
  // let modifiedSlug = `${payload.slug}-division`
  //   .split(" ")
  //   .join("-")
  //   .toLocaleLowerCase();
  // let counter = 0;
  // while (await divisionModel.exists({ slug: modifiedSlug})) {
  //   modifiedSlug = `${modifiedSlug}-${counter++}`;
  // }
  // payload.slug = modifiedSlug;
  const division = await divisionModel.create(payload);

  return division;
};

// Get a singel Division
const getSingelDivision = async (slug:string)=>{
  const division = await divisionModel.findOne({slug});
  if (division === null) throw new appError(StatusCodes.NOT_FOUND, "Division not found");
  return division;
};

// Getting all divisions
const getAllDivisions = async () => {
  const allDivisions = await divisionModel.find();
  console.log("No Division created yet");
  return allDivisions;
};

// Deleteing a division
const deleteDivision = async (id: string) => {
  const deletedDivision = await divisionModel.findByIdAndDelete(id);
  if (!deletedDivision)
    throw new appError(StatusCodes.NOT_FOUND, "Division not found");
  return deletedDivision;
};

// Updating Division
const updateDivision = async (id: string, payload: Partial<IDvision>) => {
  const existingDivision = await divisionModel.findById(id);
  if (!existingDivision) {
    throw new appError(StatusCodes.NOT_FOUND, "Division not found");
  }

  const isDuplicate = await divisionModel.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (isDuplicate !== null) {
    throw new appError(
      StatusCodes.BAD_REQUEST,
      "A Division with this name already exists"
    );
  }

  // // This part handled by pre hook in model
  // if (payload.name) {
  //   let modifiedSlug = `${payload.slug}-division`
  //     .split(" ")
  //     .join("-")
  //     .toLocaleLowerCase();
  //   let counter = 0;
  //   while (await divisionModel.exists({ slug: modifiedSlug })) {
  //     modifiedSlug = `${modifiedSlug}-${counter++}`;
  //   }
  //   payload.slug = modifiedSlug;
  // }

  const updatedNewDivision = await divisionModel.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  );

  if (!updatedNewDivision) {
    throw new appError(StatusCodes.NOT_FOUND, "Division not found");
  }

  if (payload.thumbnail && existingDivision.thumbnail) {
    await deleteImageFromCloudinary(existingDivision.thumbnail)
  }

  return updatedNewDivision;
};

export const divisionServices = {
  createDivision,
  getAllDivisions,
  deleteDivision,
  updateDivision,
getSingelDivision,

};
