import { StatusCodes } from "http-status-codes"
import appError from "../../errorHelper/appError"
import { IUser } from "../users/user.interface"
import { userModel } from "../users/user.model"
import bcrypt  from 'bcrypt';
import jwt from "jsonwebtoken"

const credentialsLogin = async (payload:Partial<IUser>) =>{
    const {email, password} = payload

    const existedUser = await userModel.findOne({email})
    if(!existedUser) throw new appError(StatusCodes.NOT_FOUND, "User not exist");

    const isLoggedIn = await bcrypt.compare(password as string, existedUser.password as string)
    if(!isLoggedIn) throw new appError(StatusCodes.BAD_REQUEST, "Invalid Password");

    const jwtPayload = {
        email:existedUser.email,
        name:existedUser.name,
        role:existedUser.role,
    }
 
    const accessToken = jwt.sign(jwtPayload, "OwnSecretSignatureForJWT", {expiresIn: "1d"})

    return {
        email: existedUser.email,
        accessToken,
    }  
}

export const authServices ={
    credentialsLogin
}
