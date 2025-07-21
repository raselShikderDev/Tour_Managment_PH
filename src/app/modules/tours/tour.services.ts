/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { ITour, ITourTypes } from "./tour.interface";
import { tourModel, tourTypeModel } from "./tour.model";
import { Query } from "mongoose";

/**--------------------------- Tour types Services -------------------------- */
// Creating Tourtype
const createTourType = async (payload: Partial<ITourTypes>) => {
  if (!payload) {
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Tourtypes's infromation not found"
    );
  }

  const newTourtype = await tourTypeModel.create(payload);
  return newTourtype;
};

// Retriving all tours
const getAllTourType = async () => {
  const totalTourType = await tourTypeModel.countDocuments();

  const allTourType = await tourTypeModel.find().limit(10);
  console.log("No TourType created yet");
  return {
    meta: {
      total: totalTourType,
    },
    data: allTourType,
  };
};

// Deleting a TourType
const deleteTourType = async (id: string) => {
  const deletedATourType = await tourTypeModel.findByIdAndDelete(id);
  if (!deleteTourType)
    throw new appError(StatusCodes.NOT_FOUND, "Tourtype not found");
  return deletedATourType;
};

// Updating TourType
const updateTourType = async (id: string, payload: Partial<ITourTypes>) => {
  if (!payload)
    throw new appError(
      StatusCodes.NOT_FOUND,
      "TourType's updated infromation not found"
    );

  const isExist = await tourTypeModel.findById(id);
  if (!isExist) {
    throw new appError(StatusCodes.NOT_FOUND, "TourType not found");
  }

  const isDuplicate = await tourTypeModel.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (isDuplicate !== null) {
    throw new appError(
      StatusCodes.BAD_REQUEST,
      "A TourType with this title already exists"
    );
  }

  const updatedNewTourType = await tourTypeModel.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  );
  if (!updatedNewTourType)
    throw new appError(StatusCodes.NOT_FOUND, "TourType not found");

  return updatedNewTourType;
};

export const tourTypeServices = {
  createTourType,
  getAllTourType,
  deleteTourType,
  updateTourType,
};

/**------------------------------ Tour Services -------------------------------- */
//Creating tour
const createTour = async (payload: ITour) => {
  if (!payload) {
    throw new appError(StatusCodes.NOT_FOUND, "Tour's infromation not found");
  }

  // // This part handled by pre hook in model
  // let modifiedSlug = `${payload.title}`.split(" ").join("-").toLocaleLowerCase()
  //   .split(" ")
  //   .join("-")
  //   .toLocaleLowerCase();
  // let counter = 0;

  // while (await tourModel.exists({ slug: modifiedSlug })) {
  //   modifiedSlug = `${modifiedSlug}-${counter++}`;

  // }
  // payload.slug = modifiedSlug;
  const newTour = await tourModel.create(payload);

  return newTour;
};

// Retriving all tours
const getAllTour = async (query: Record<string, string>) => {
  const filter = query;
    console.log("Query: ", query);
  const searchItem = query.searchItem || "";
  console.log("searchItem: ", searchItem);
  const sort = query.sort || "-createdAt"
  const feilds = query.feilds.split(",").join(" ") || ""
  const tourSearchableItem = ["title", "description", "location"];

  const excludFeild = ["searchItem", "sort", "feilds"]

  for(const feild of excludFeild){
    delete filter[feild]
  }

  const totalTour = await tourModel.countDocuments();
  const searchQuery = {
    $or: tourSearchableItem.map((feild) => ({
      [feild]: { $regex: searchItem, $options: "i" },
    })),
  };
  const allTours = await tourModel.find(searchQuery).find(filter).sort(sort).select(feilds);
  console.log("No Tour created yet");
  return {
    meta: {
      total: totalTour,
    },
    data: allTours,
  };
};

// Deleting a Tour
const deleteTour = async (id: string) => {
  const deletedATour = await tourModel.findByIdAndDelete(id);
  if (!deleteTour) throw new appError(StatusCodes.NOT_FOUND, "Tour not found");
  return deletedATour;
};

// Updating Tour
const updateTour = async (id: string, payload: Partial<ITour>) => {
  if (!payload)
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Tour's updated infromation not found"
    );

  const isExist = await tourModel.findById(id);
  if (!isExist) {
    throw new appError(StatusCodes.NOT_FOUND, "Tour not found");
  }

  const isDuplicate = await tourModel.findOne({
    title: payload.title,
    _id: { $ne: id },
  });
  if (isDuplicate !== null) {
    throw new appError(
      StatusCodes.BAD_REQUEST,
      "A Tour with this title already exists"
    );
  }

  // // This part handled by pre hook in model
  // if (payload.title) {
  //   let modifiedSlug = `${payload.title}`.split(" ").join("-")
  //   .split(" ")
  //   .join("-")
  //   .toLocaleLowerCase();
  // let counter = 0;
  // while (await tourModel.exists({ slug: modifiedSlug })) {
  //   modifiedSlug = `${modifiedSlug}-${counter++}`;
  // }
  // payload.slug = modifiedSlug;
  // }

  const updatedNewTour = await tourModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updatedNewTour)
    throw new appError(StatusCodes.NOT_FOUND, "Tour not found");

  return updatedNewTour;
};

export const tourServices = {
  createTour,
  getAllTour,
  deleteTour,
  updateTour,
};
