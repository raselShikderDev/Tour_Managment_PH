import { IUser } from "./user.interface";
import { userModel } from "./user.model";

const createUser= async (payload:Partial<IUser>)=>{
    const {name, email} = payload

    const user = await userModel.create({
        name,
        email
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




export const userServices = {
    createUser,
    getAllUser
}

