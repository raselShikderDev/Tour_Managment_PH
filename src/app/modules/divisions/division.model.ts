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
    },
    thumbnail:String,
    description:String,
},{
    timestamps:true,
})

// Pre hook for adding division at the end of slug while creating 
divisionSchema.pre("save", async function(next){
    let modifiedSlug = `${this.slug}-division`
    .split(" ")
    .join("-")
    .toLocaleLowerCase();
  let counter = 0;
  while (await divisionModel.exists({ slug: modifiedSlug})) {
    modifiedSlug = `${modifiedSlug}-${counter++}`;
  }
  this.slug = modifiedSlug;
    next()
})

// Pre hook for adding division at the end of slug while updating divisin
divisionSchema.pre("findOneAndUpdate", async function(next){
    const division = this.getUpdate() as Partial<IDvision>
    if(division.name){
        let modifiedSlug = `${division.slug}-division`
      .split(" ")
      .join("-")
      .toLocaleLowerCase();
    let counter = 0;
    while (await divisionModel.exists({ slug: modifiedSlug })) {
      modifiedSlug = `${modifiedSlug}-${counter++}`;
    }
    division.slug = modifiedSlug;
    this.setUpdate(division)
    }
    next()
})

export const divisionModel = mongoose.model("Division", divisionSchema)