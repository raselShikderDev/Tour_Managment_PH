import mongoose, { Schema } from "mongoose";
import { ITour, ITourTypes } from "./tour.interface";



const tourTypeSchema = new Schema<ITourTypes>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
  
);



export const tourTypeModel = mongoose.model<ITourTypes>(
  "TourTypes",
  tourTypeSchema
);




const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    location: { type: String },
    description: { type: String },
    costForm: { type: Number },
    images: { type: [String], default: [] },
    startDate: { type: Date },
    endDate: { type: Date },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      requiured: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourTypes",
      requiured: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre hook for adding Tour slug at the end of slug while creating tour
tourSchema.pre("save", async function (next) {
  let modifiedSlug = `${this.title}`
    .split(" ")
    .join("-")
    .toLocaleLowerCase()
    .split(" ")
    .join("-")
    .toLocaleLowerCase();
  let counter = 0;

  while (await tourModel.exists({ slug: modifiedSlug })) {
    modifiedSlug = `${modifiedSlug}-${counter++}`;
  }
  this.slug = modifiedSlug;
  next();
});

// Pre hook for adding Tour slug at the end of slug while updating tour
tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as Partial<ITour>;
  
  if (tour.title) {
    let modifiedSlug = `${tour.title}`
      .split(" ")
      .join("-")
      .split(" ")
      .join("-")
      .toLocaleLowerCase();
    let counter = 1;
    while (await tourModel.exists({ slug: modifiedSlug })) {
      modifiedSlug = `${modifiedSlug}-${counter++}`;
    }
    tour.slug = modifiedSlug;
    this.setUpdate(tour)
  }
  
  if (tour.slug) {
    let modifiedSlug = `${tour.slug}`
      .split(" ")
      .join("-")
      .split(" ")
      .join("-")
      .toLocaleLowerCase();
    let counter = 1;
    while (await tourModel.exists({ slug: modifiedSlug })) {
      modifiedSlug = `${modifiedSlug}-${counter++}`;
    }
    tour.slug = modifiedSlug;
    this.setUpdate(tour)
  }
  next();
});

export const tourModel = mongoose.model<ITour>("Tour", tourSchema);
