import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { IAuthProvider, IUser, role } from "./user.interface";
import { userModel } from "./user.model";
import bcrypt from "bcrypt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


// Create a user
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  
  const existsUser = await userModel.findOne({ email });
  if (existsUser)
    throw new appError(StatusCodes.BAD_REQUEST, "User already exists");

  const hashedPasswrd = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "Credentials",
    providerId: email as string,
  };

  const user = await userModel.create({
    email,
    password: hashedPasswrd,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

// Get All user
const getAllUser = async () => {
  const allUser = await userModel.find({});
  const meta = await userModel.countDocuments();
  return {
    data: allUser,
    meta: meta,
  };
};

// Get a singel User
const getSingelUser = async (id:string)=>{
  const user = await userModel.findById(id);
  if (user === null) throw new appError(StatusCodes.NOT_FOUND, "User not found");
  return user;
};

// Update a user
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {

  if (decodedToken.role ===role.USER || decodedToken.role === role.GUIDE) {
    if (decodedToken.userId !== userId) {
      throw new appError(StatusCodes.UNAUTHORIZED, "You are not authorized to update")
    }
  }

  const userExist = await userModel.findById(userId);
  if (!userExist) throw new appError(StatusCodes.NOT_FOUND, "User not found");

  if (decodedToken.role === role.ADMIN && userExist.role === role.SUPER_ADMIN) {
    throw new appError(StatusCodes.UNAUTHORIZED, "You are not allowed to update")
  }

// if user want to change role
  if (payload.role) {
    // If user not admin or super admin
    if (decodedToken.role === role.USER || decodedToken.role === role.GUIDE) {
      throw new appError(StatusCodes.FORBIDDEN, "You are not authorized");
    }

    // if user admin but want to promote to super admin - (ONly super admin can promote to super admin)
    if (payload.role === role.SUPER_ADMIN || decodedToken.role === role.ADMIN) {
      throw new appError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isVerified || payload.isDeleted) {
    if (decodedToken.role === role.USER || decodedToken.role === role.GUIDE) {
      throw new appError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  // if (payload.password) {
  //   payload.password = await bcrypt.hash(
  //     payload.password,
  //     Number(envVars.BCRYPT_SALT_ROUND)
  //   );
  // }

  const updateUser = await userModel.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return updateUser;
};

// Delete a user
const deleteuser = async (userid:string)=>{
  const deletedUser = await userModel.findByIdAndDelete(userid)
  return deletedUser
}

// Get my profile's information
const getMe = async (decodedToken:JwtPayload)=>{
  const user = await userModel.findById(decodedToken.userId);
  if (user === null) throw new appError(StatusCodes.NOT_FOUND, "Your profile's information not found");
  return user;
};

export const userServices = {
  createUser,
  getAllUser,
  updateUser,
  deleteuser,
  getSingelUser,
  getMe,
};
