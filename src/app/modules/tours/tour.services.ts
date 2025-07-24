/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { ITour, ITourTypes } from "./tour.interface";
import { tourModel, tourTypeModel } from "./tour.model";
import {  tourSearchableField } from "./tour.const.varriables";
import { QueryBuilder } from "../../utils/queryBuilder";

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

// Get singel a TourType by id
const getSingelTourType = async (id: string) => {
  const tourType = await tourModel.findById(id);
  if (tourType === null) throw new appError(StatusCodes.NOT_FOUND, "Tour not found");
  return tourType;
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
  getSingelTourType
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

// Get singel a Tour by slug
const getSingelTour = async (slug: string) => {
  const tour = await tourModel.findOne({slug});
  if (tour === null) throw new appError(StatusCodes.NOT_FOUND, "Tour not found");
  return tour;
};

// Retriving all tours bu query buuilder class
const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(tourModel.find(), query);

  const tours = await queryBuilder
    .search(tourSearchableField)
    .filter()
    .select()
    .sort()
    .pagginate()

  const [ data, meta ] = await Promise.all([
    tours.build(), 
    queryBuilder.getMeta(),
  ]);
console.log("data: ", data);
console.log("meta: ", meta);

  return {
    data,
    meta,
  };
};

// // Retriving all tours Original/ Old raw code
// const getAllTourOld = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchItem = query.searchItem || "";

//   const sort = query.sort || "-createdAt"
//   const field = query.fields ? query.fields.split(",").join(" ") : ""
//   const page = Number(query.page) || 1
//   const limit = Number(query.limit) || 5
//   const skip = (page - 1) * limit

//   for(const field of excludFields){
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field]
//   }

//   const totalTour = await tourModel.countDocuments();
//   const totalPages = Math.ceil(totalTour / limit)
//   const searchQuery = {
//     $or: tourSearchableField.map((field) => ({
//       [field]: { $regex: searchItem, $options: "i" },
//     })),
//   };
//   // const allTours = await tourModel.find(searchQuery).find(filter).sort(sort).select(field).skip(skip).limit(limit);

// const filterQuery = tourModel.find(filter)
// const tours = filterQuery.find(searchQuery)
// const allTours = await tours.sort(sort).select(field).skip(skip).limit(limit);

//   console.log("No Tour created yet");
//   const meta = {
//     pages:totalPages,
//     total:totalTour,
//     limit,
//   }
//   return {
//     meta: meta,
//     data: allTours,
//   };
// };

// Deleting a Tour
const deleteTour = async (id: string) => {
  const deletedATour = await tourModel.findByIdAndDelete(id);
  if (!deleteTour) throw new appError(StatusCodes.NOT_FOUND, "Tour not found");
  return deletedATour;
};

// Updating Tour
const updateTour = async (id: string, payload: Partial<ITour>) => {
  console.log("Tour updated request recived: ", payload);
  

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
  getSingelTour,
};
