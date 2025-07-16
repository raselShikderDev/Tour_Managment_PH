import { Types } from "mongoose";


export interface ITourTypes{
    name:string,
}


export interface ITour{
    title:string;
    slug:string;
    description?:string,
    images?:string[],
    location?:string,
    costForm?:number,
    startDate?:Date,
    endDate?:Date,
    tourType?:Types.ObjectId,
    included?:string[],
    excluded?:string[],
    amenities?:string[],
    tourPlan?:string[],
    maxGuest?:number,
    minAge?:number,
    division:Types.ObjectId,
}