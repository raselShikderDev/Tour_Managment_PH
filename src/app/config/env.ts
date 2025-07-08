/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from "dotenv";

dotenv.config();

interface IEnvVars {
  MONGO_URI: string;
  PORT: string; // In video it defined as string in the last video of module 25
  NODE_ENV: "Development" | "Production";
}

const loadEnvVariables = () => {
    const requiredEnv:string[] = ["MONGO_URI", "PORT", "NODE_ENV"]
    requiredEnv.forEach((elem)=>{
        if (!process.env[elem]) {
            throw new Error(`Missing envoirnment varriabls ${elem}`);
        }
    })
  return {
    MONGO_URI: process.env.MONGO_URI as string,
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
  };
};



export const envVars = loadEnvVariables()
