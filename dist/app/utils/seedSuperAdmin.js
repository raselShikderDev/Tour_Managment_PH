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
exports.seedSuperAdmin = void 0;
/* eslint-disable no-console */
const env_1 = require("../config/env");
const user_model_1 = require("../modules/users/user.model");
const user_interface_1 = require("../modules/users/user.interface");
const bcrypt_1 = __importDefault(require("bcrypt"));
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (env_1.envVars.NODE_ENV === "Development") {
            console.log("started checkng super admin exists");
        }
        const superAdminExist = yield user_model_1.userModel.findOne({
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
        });
        if (superAdminExist) {
            // console.log(`Superadmin existed: ${superAdminExist}`);
            return;
        }
        if (env_1.envVars.NODE_ENV === "Development") {
            console.log("Creating super admin");
        }
        const hasedPassword = yield bcrypt_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const authprovier = {
            provider: "Credentials",
            providerId: env_1.envVars.SUPER_ADMIN_EMAIL,
        };
        const superAdmin = {
            name: "Super Admin",
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            password: hasedPassword,
            role: user_interface_1.role.SUPER_ADMIN,
            isVerified: true,
            auths: [authprovier],
        };
        user_model_1.userModel.create(superAdmin);
        if (env_1.envVars.NODE_ENV === "Development") {
            console.log("Super admin created successfully");
        }
    }
    catch (error) {
        console.log(`Faild to create default super admin: ${error}`);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
