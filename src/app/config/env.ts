/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from "dotenv";

dotenv.config();

interface IEnvVars {
  MONGO_URI: string;
  PORT: string; // In video it defined as string in the last video of module 25
  NODE_ENV: "Development" | "Production";
  JWT_ACCESS_EXPIRES:string;
  JWT_ACCESS_SECRET:string;
  BCRYPT_SALT_ROUND:string;
  SUPER_ADMIN_PASSWORD:string;
  SUPER_ADMIN_EMAIL:string;
  JWT_REFRESH_SECRET:string;
  JWT_REFRESH_EXPIRES:string;
}

const loadEnvVariables = () => {
    const requiredEnv:string[] = ["MONGO_URI", "PORT", "NODE_ENV", "JWT_ACCESS_EXPIRES", "JWT_ACCESS_SECRET", "BCRYPT_SALT_ROUND", "SUPER_ADMIN_PASSWORD","SUPER_ADMIN_EMAIL", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES"]
    requiredEnv.forEach((elem)=>{
        if (!process.env[elem]) {
            throw new Error(`Missing envoirnment varriabls ${elem}`);
        }
    })
  return {
    MONGO_URI: process.env.MONGO_URI as string,
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
    JWT_ACCESS_EXPIRES:process.env.JWT_ACCESS_EXPIRES,
    JWT_ACCESS_SECRET:process.env.JWT_ACCESS_SECRET,
    BCRYPT_SALT_ROUND:process.env.BCRYPT_SALT_ROUND,
    SUPER_ADMIN_EMAIL:process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD:process.env.SUPER_ADMIN_PASSWORD,
    JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES:process.env.JWT_REFRESH_EXPIRES,
  };
};



export const envVars = loadEnvVariables()
