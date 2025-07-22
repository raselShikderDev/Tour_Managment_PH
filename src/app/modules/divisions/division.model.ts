import mongoose, { Schema } from "mongoose";
import { IDvision } from "./division.interface";

const divisionSchema = new Schema<IDvision>({
    name:{
        type:String,
        unique:true,
        required:true,
    },
    slug:{
        type:String,
        unique:true,
        required:true,
    },
    thumbnail:String,
    description:String,
},{
    timestamps:true,
})

export const divisionModel = mongoose.model("Division", divisionSchema)