import mongoose, { Schema } from "mongoose";
import { ITour, ITourTypes } from "./tour.interface";

const tourTypeSchema = new Schema<ITourTypes>({
    name:{type:String, required:true, unique:true}
},{
    timestamps:true,
})

export const tourTypeModel = mongoose.model<ITourTypes>("TourTypes", tourTypeSchema)

const tourSchema = new Schema<ITour>({
    title:{
        type:String,
        unique:true,
        required:true,
    },
    slug:{
        type:String,
        unique:true,
        required:true,
    },
    location:{type:String},
    description:{type:String},
    costForm:{type:Number},
    images:{type:[String], default:[]},
    startDate:{type:Date},
    endDate:{type:Date},
    included:{type:[String], default:[]},
    excluded:{type:[String], default:[]},
    amenities:{type:[String], default:[]},
    tourPlan:{type:[String], default:[]},
    maxGuest:{type:Number},
    minAge:{type:Number},
    division:{
        type:Schema.Types.ObjectId,
        ref:"Division",
        requiured:true,
    },
    tourType:{
        type:Schema.Types.ObjectId,
        ref:"TourTypes",
        requiured:true,
    }
},{
    timestamps:true,
})

export const tourModel = mongoose.model<ITour>("Tour", tourSchema)