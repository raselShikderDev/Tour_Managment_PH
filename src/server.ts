/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;
const port = 5000;

const startServer = async () => {
    
  try {
    await mongoose.connect(
      "mongodb+srv://mongodb:mongodb@cluster0.em4cgxh.mongodb.net/Tour_Managment_PH?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB has connected successfully");

    server = app.listen(port, () => {
      console.log(`Server is running at port ${port} http://localhost:${port}`);
    });
  } catch (error) {
    console.log(`Faild to connect with Database or Server: ${error}`);
  }
};

startServer();

/**
 * Unhandled rejection Error
 * Uncaught rejection Error
 * signal termination - sigterm
 */

// Unhandaled Rejection Error
process.on("unhandledRejection", (err)=>{
    console.log("Unhandled Rejection detected..! Server shutting Down: ", err);
    if (server) {
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
// Promise.reject(new Error("I forgot to detect this"))
 

// Uncaugh Exception Error
process.on("uncaughtException", (err)=>{
    console.log("Uncaught Exception detected..! Server shutting Down: ", err);
    if (server) {
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
// Promise.reject(new Error("I forgot to detect this"))
 

// Signal Termination Error - Option - 01 (does owner of server like AWS)
process.on("SIGTERM", (err)=>{
    console.log("SIGTERM signal is recieved..! Server shutting Down: ", err);
    if (server) {
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
 
// Signal Termination Error - Option - 02
process.on("SIGINT", (err)=>{
    console.log("SIGINT signal is recieved..! Server shutting Down: ", err);
    if (server) {
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})