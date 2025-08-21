"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const redis_config_1 = require("./app/config/redis.config");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.MONGO_URI);
        if (env_1.envVars.NODE_ENV === "Development") {
            console.log("MongoDB has connected successfully");
        }
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            if (env_1.envVars.NODE_ENV === "Development") {
                console.log(`Server is running at http://localhost:${env_1.envVars.PORT}`);
            }
        });
    }
    catch (error) {
        console.log(`Faild to connect with Database or Server: ${error}`);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
    yield startServer();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
}))();
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
