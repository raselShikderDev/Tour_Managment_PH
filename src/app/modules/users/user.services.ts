/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { IAuthProvider, IUser } from "./user.interface";
import { userModel } from "./user.model";
import bcrypt from "bcrypt";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const existsUser = await userModel.findOne({ email });
  if (existsUser)
    throw new appError(StatusCodes.BAD_REQUEST, "User already exists");

  const hashedPasswrd = await bcrypt.hash(password as string, 10);

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

const getAllUser = async () => {
  const allUser = await userModel.find({});
  const meta = await userModel.countDocuments();
  return {
    data: allUser,
    meta: meta,
  };
};

const updateUser = async (
  userEmail:string,
  payload: Partial<IUser>
) => {
      console.log("services - userEmail: ", userEmail);
      console.log("services - payload: ", payload);

  const updateUser = await userModel.findOneAndUpdate(
    {userEmail},
    { $set: payload },
    { new: true }
  );
  console.log("services - UpdatedUser: ", updateUser);
  
  if (!updateUser) throw new appError(StatusCodes.NOT_FOUND, "user not exists");
  return updateUser;
};

export const userServices = {
  createUser,
  getAllUser,
  updateUser,
};
