import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { IDvision } from "./division.interface";
import { divisionModel } from "./division.model";

// Creating Division
const createDivision = async (payload: IDvision) => {
  if (!payload)
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Division's infromation not found"
    );

  const division = await divisionModel.create(payload);

  return division;
};

// Getting all divisions
const getAllDivisions = async()=>{
    const allDivisions = await divisionModel.find()
      // eslint-disable-next-line no-console
   console.log("No Division created yet");
    return allDivisions
}

// Deleteing a division
const deleteDivision = async(id:string)=>{
    const deletedDivision = await divisionModel.findByIdAndDelete(id)
    if(!deletedDivision) throw new appError(StatusCodes.NOT_FOUND, "Division not found")
    return deletedDivision 
}


// Updating Division
const updateDivision = async (id:string, payload: Partial<IDvision>) => {
  if (!payload)
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Division's updated infromation not found"
    );

  const updatedNewDivision = await divisionModel.findByIdAndUpdate(id,payload, {new:true, runValidators:true,});
  if(!updatedNewDivision) throw new appError(StatusCodes.NOT_FOUND, "Division not found")

  return updatedNewDivision;
};


export const divisionServices = {
  createDivision,
  getAllDivisions,
  deleteDivision,
  updateDivision,
};
