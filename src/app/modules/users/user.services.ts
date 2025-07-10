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

export const userServices = {
    createUser
}