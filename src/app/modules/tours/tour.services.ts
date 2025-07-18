import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { ITour } from "./tour.interface";
import { tourModel } from "./tour.model";

//Creating tour
const createTour = async (payload: ITour) => {
  if (!payload) {
    throw new appError(StatusCodes.NOT_FOUND, "Tour's infromation not found");
  }

  const newTour = await tourModel.create(payload);
  return newTour;
};

// Retriving all tours
const getAllTour = async()=>{
   const allTours = await tourModel.find().sort({startDate:1}).limit(10)
   // eslint-disable-next-line no-console
   console.log("No Tour created yet");
   return allTours
    
}

// Deleting a Tour tours
const deleteTour = async(id:string)=>{
    const deletedATour = await tourModel.findByIdAndDelete(id)
      if(!deleteTour) throw new appError(StatusCodes.NOT_FOUND, "Tour not found")
    return deletedATour
}

// Updating Tour
const updateTour = async (id:string, payload: Partial<ITour>) => {
  if (!payload)
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Division's updated infromation not found"
    );

  const updatedNewTour = await tourModel.findByIdAndUpdate(id,payload, {new:true, runValidators:true,});
  if(!updatedNewTour) throw new appError(StatusCodes.NOT_FOUND, "Tour not found")

  return updatedNewTour;
};

export const tourServices = {
  createTour,
  getAllTour,
  deleteTour,
  updateTour,
};
