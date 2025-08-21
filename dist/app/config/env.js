"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredEnv = [
        "MONGO_URI",
        "PORT",
        "NODE_ENV",
        "JWT_ACCESS_EXPIRES",
        "JWT_ACCESS_SECRET",
        "BCRYPT_SALT_ROUND",
        "SUPER_ADMIN_PASSWORD",
        "SUPER_ADMIN_EMAIL",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_SECRET",
        "GOOGLE_CALLBACK_URL",
        "EXPRESS_SESSION_SECRET",
        "FRONEND_URL",
        "SSL_VALIDATION_API",
        "SSL_PAYMENT_API",
        "SSL_SECRET_KEY",
        "SSL_STORE_ID",
        "SSL_SUCCESS_BACKEND_URL",
        "SSL_CANCEL_BACKEND_URL",
        "SSL_FAIL_BACKEND_URL",
        "SSL_CANCEL_FRONTEND_URL",
        "SSL_FAIL_FRONTEND_URL",
        "SSL_SUCCESS_FRONTEND_URL",
        "CLOUDINARY_URL",
        "CLOUDINARY_API_SECRET",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_NAME",
        "SMTP_HOST",
        "SMTP_FROM",
        "SMTP_PASS",
        "SMTP_PORT",
        "SMTP_USER",
        "REDIS_HOST",
        "REDIS_PORT",
        "REDIS_USERNAME",
        "REDIS_PASSWORD",
        "SSL_IPN_URL",
    ];
    requiredEnv.forEach((elem) => {
        if (!process.env[elem]) {
            throw new Error(`Missing envoirnment varriabls ${elem}`);
        }
    });
    return {
        MONGO_URI: process.env.MONGO_URI,
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_SECRET: process.env.GOOGLE_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        FRONEND_URL: process.env.FRONEND_URL,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_FROM: process.env.SMTP_FROM,
        SMTP_PASS: process.env.SMTP_PASS,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PORT: process.env.SMTP_PORT,
        SSL: {
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
            SSL_SECRET_KEY: process.env.SSL_SECRET_KEY,
            SSL_STORE_ID: process.env.SSL_STORE_ID,
            SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
            SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
            SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
            SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL,
            SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
            SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
            SSL_IPN_URL: process.env.SSL_IPN_URL,
        },
        CLOUDINARY: {
            CLOUDINARY_URL: process.env.CLOUDINARY_URL,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
        },
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT,
        REDIS_USERNAME: process.env.REDIS_USERNAME,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    };
};
exports.envVars = loadEnvVariables();
