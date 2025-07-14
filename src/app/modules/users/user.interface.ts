// User: // name: String // email: String (unique) // password: String // role: String (e.g., Admin, User) // phone: String // picture: String // address: String // isDeleted: Boolean // isActive: String (e.g., Active, Inactive) // isVerified: Boolean // auths: Array of auth providers (e.g., Google, Facebook)

import { Types } from "mongoose";

export enum role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
    GUIDE = "GUIDE"
}

/**
 * Email, Password
 * Google Authentication
 */

export interface IAuthProvider{
    provider: "Google" | "Credentials"; // Google, Credentials
    providerId:string;
}

export enum isActive{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}

export interface IUser{
    _id?:Types.ObjectId
    name:string;
    email:string;
    password?:string;
    role:role;
    phone?:string;
    picture?:string;
    address?:string;
    isDeleted?:boolean;
    isActive?:isActive;
    isVerified?:boolean;
    auths:IAuthProvider[];
    bookings?:Types.ObjectId[];
    guide?:Types.ObjectId[];
}