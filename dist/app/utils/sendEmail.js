"use strict";
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const appError_1 = __importDefault(require("../errorHelper/appError"));
const transporter = nodemailer_1.default.createTransport({
    port: Number(env_1.envVars.SMTP_PORT),
    host: env_1.envVars.SMTP_HOST,
    auth: {
        user: env_1.envVars.SMTP_USER,
        pass: env_1.envVars.SMTP_PASS,
    },
    secure: true,
});
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, templateName, templateData, attachments, }) {
    try {
        if (env_1.envVars.NODE_ENV === "Development")
            console.log("started sending email");
        const templatePath = path_1.default.join(__dirname, `templates/${templateName}.ejs`);
        const html = yield ejs_1.default.renderFile(templatePath, templateData);
        const info = yield transporter.sendMail({
            from: env_1.envVars.SMTP_FROM,
            to,
            subject,
            html: html,
            attachments: attachments === null || attachments === void 0 ? void 0 : attachments.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            })),
        });
        if (env_1.envVars.NODE_ENV === "Development")
            console.log(`\u2709\uFE0F Email send to ${to}: ${info.messageId}`);
    }
    catch (error) {
        if (env_1.envVars.NODE_ENV === "Development")
            console.log(error);
        throw new appError_1.default(401, "Sending email error");
    }
});
exports.sendEmail = sendEmail;
// http://localhost:3000/forgot-password?id=68972656c39528daa0a108bc&resetToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjg5NzI2NTZjMzk1MjhkYWEwYTEwOGJjIiwiZW1haWwiOiJyYXNlbC5haG1lZC55dEBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1NDczNzUwNiwiZXhwIjoxNzU0NzM3ODA2fQ._QgyCLQtL2_N1iP3UGUW3jDCxJro1hGq68pdsXI_dxw
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import ejs from "ejs";
// import nodemailer from "nodemailer";
// import path from "path";
// import { envVars } from "../config/env";
// import appError from "../errorHelper/appError";
// const transporter = nodemailer.createTransport({
//     // port: envVars.EMAIL_SENDER.SMTP_PORT,
//     secure: true,
//     auth: {
//         user: envVars.SMTP_USER,
//         pass: envVars.SMTP_PASS
//     },
//     port: Number(envVars.SMTP_PORT),
//     host: envVars.SMTP_HOST
// })
// interface SendEmailOptions {
//     to: string,
//     subject: string;
//     templateName: string;
//     templateData?: Record<string, any>
//     attachments?: {
//         filename: string,
//         content: Buffer | string,
//         contentType: string
//     }[]
// }
// export const sendEmail = async ({
//     to,
//     subject,
//     templateName,
//     templateData,
//     attachments
// }: SendEmailOptions) => {
//     try {
//         const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
//         const html = await ejs.renderFile(templatePath, templateData)
//         const info = await transporter.sendMail({
//             from: envVars.SMTP_FROM,
//             to: to,
//             subject: subject,
//             html: html,
//             attachments: attachments?.map(attachment => ({
//                 filename: attachment.filename,
//                 content: attachment.content,
//                 contentType: attachment.contentType
//             }))
//         })
//         console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
//     } catch (error: any) {
//         console.log("email sending error", error.message);
//         throw new appError(401, "Email error")
//     }
// }
