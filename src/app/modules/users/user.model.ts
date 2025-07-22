import mongoose from "mongoose";
import { IAuthProvider, isActive, IUser, role } from "./user.interface";


const authProviderSchema = new mongoose.Schema<IAuthProvider>({
    provider:{
        type:String,
        required:true,
    },
    providerId:{
        type:String,
        required:true,
    }
},{
    versionKey:false,
    _id:false,
})

const userSchema = new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:String,
    role:{
        type:String,
        enum:Object.values(role),
        default:role.USER
    },
    phone:String,
    picture:String,
    address:String,
    isDeleted:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:String,
        enum:Object.values(isActive),
        default:isActive.ACTIVE
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    auths:{
        type:[authProviderSchema]
    }
},{
    timestamps:true,
    versionKey:false,
})


export const userModel = mongoose.model<IUser>("Users", userSchema)