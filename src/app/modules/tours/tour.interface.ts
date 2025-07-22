import { Types } from "mongoose";


export interface ITourTypes{
    name:{type:string, uniqe:true},
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
    departureLocation:string,
    arrivalLocation:string,
    tourType?:Types.ObjectId,
    included?:string[],
    excluded?:string[],
    amenities?:string[],
    tourPlan?:string[],
    maxGuest?:number,
    minAge?:number,
    division:Types.ObjectId,
}