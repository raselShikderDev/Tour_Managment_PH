import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { IAuthProvider, IUser } from "./user.interface";
import { userModel } from "./user.model";
import bcrypt  from 'bcrypt';

const createUser= async (payload:Partial<IUser>)=>{
    const { email, password, ...rest} = payload

    const existsUser = await userModel.find({email})

    if(existsUser) throw new appError(StatusCodes.BAD_REQUEST, "User already exists");

    const hashedPasswrd = await bcrypt.hash(password as string, 10)

    const authProvider:IAuthProvider = {
        provider:"Credentials",
        providerId:email as string,
    }
    

    const user = await userModel.create({
        email,
        password:hashedPasswrd,
        auths:[authProvider],
        ...rest
    })
    return user
}

const getAllUser = async ()=>{
    const allUser = await userModel.find({})
    const meta = await userModel.countDocuments()
    return {
        data: allUser,
        meta: meta
    }
}

// const updateUser = async (payload:Partial<IUser>)=>{
//     const _id
// }




export const userServices = {
    createUser,
    getAllUser
}

