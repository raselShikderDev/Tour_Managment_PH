/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.MONGO_URI);
    if (envVars.NODE_ENV === "Development") {
      console.log("MongoDB has connected successfully");
    }

    server = app.listen(envVars.PORT, () => {
      if (envVars.NODE_ENV === "Development") {
        console.log(`Server is running at http://localhost:${envVars.PORT}`);
      }
    });
  } catch (error) {
    console.log(`Faild to connect with Database or Server: ${error}`);
  }
};

(async () => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

/**
 * Unhandled rejection Error
 * Uncaught rejection Error
 * signal termination - sigterm
 */

// Unhandaled Rejection Error
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected..! Server shutting Down: ", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
// Promise.reject(new Error("I forgot to detect this"))

// Uncaugh Exception Error
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected..! Server shutting Down: ", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
// Promise.reject(new Error("I forgot to detect this"))

// Signal Termination Error - Option - 01 (does owner of server like AWS)
process.on("SIGTERM", (err) => {
  console.log("SIGTERM signal is recieved..! Server shutting Down: ", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Signal Termination Error - Option - 02
process.on("SIGINT", (err) => {
  console.log("SIGINT signal is recieved..! Server shutting Down: ", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
