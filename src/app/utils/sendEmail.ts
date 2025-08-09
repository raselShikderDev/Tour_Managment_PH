/* eslint-disable @typescript-eslint/no-explicit-any */

import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import ejs from "ejs";
import path from "path";
import appError from "../errorHelper/appError";

const transporter = nodemailer.createTransport({
  port: Number(envVars.SMTP_PORT),
  host: envVars.SMTP_HOST as string,
  auth: {
    user: envVars.SMTP_USER as string,
    pass: envVars.SMTP_PASS as string,
  },
  secure: true,
});

interface sendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: sendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVars.SMTP_FROM,
      to,
      subject,
      html:html,
      attachments: attachments?.map((attachment) => ({
        fileName: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    // eslint-disable-next-line no-console
    if (envVars.NODE_ENV === "Development") console.log(`\u2709\uFE0F Email send to ${to}: ${info.messageId}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    if (envVars.NODE_ENV === "Development") console.log(error);
    throw new appError(401, "Sending email erorr");
  }
};



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