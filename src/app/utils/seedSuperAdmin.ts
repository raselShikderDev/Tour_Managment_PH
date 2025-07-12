/* eslint-disable no-console */
import { envVars } from "../config/env";
import { userModel } from "../modules/users/user.model";
import { IAuthProvider, IUser, role } from "../modules/users/user.interface";
import bcrypt from "bcrypt";

export const seedSuperAdmin = async () => {
  try {
    console.log("started checkng super admin existence");
    const superAdminExist = await userModel.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    console.log(`Superadmin existed: ${superAdminExist}`);
    
    if (superAdminExist) {
      console.log("Super Admin exist");
      return;
    }
    console.log("Creating super admin");

    const hasedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authprovier: IAuthProvider = {
      provider: "Credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL as string,
    };

    const superAdmin: IUser = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL as string,
      password: hasedPassword,
      role: role.SUPER_ADMIN,
      isVerified: true,
      auths: [authprovier],
    };
    userModel.create(superAdmin);
    console.log("Super admin created successfully");
  } catch (error) {
    console.log(`Faild to create default super admin: ${error}`);
  }
};
