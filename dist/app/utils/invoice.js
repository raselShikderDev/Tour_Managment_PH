"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoice = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const appError_1 = __importDefault(require("../errorHelper/appError"));
const generateInvoice = (invoiceData) => {
    const formattedDate = new Date(invoiceData.bookingDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));
            // Creating PDF
            doc.fontSize(22).text("Invoice", { align: "center" });
            doc.moveDown();
            doc.fontSize(14).text(`Transaction ID: ${invoiceData.transactionId}`);
            doc.text(`Booking Date: ${formattedDate}`);
            doc.text(`Customer : ${invoiceData.userName}`);
            doc.moveDown();
            doc.text(`Tour: ${invoiceData.tourTitle}`);
            doc.text(`Guests: ${invoiceData.guestCount}`);
            doc.text(`Total Amount: ${invoiceData.totalAmount.toFixed(2)}`);
            doc.moveDown();
            doc.text("Thank you for booking with us!", { align: "center" });
            doc.moveDown();
            doc.end();
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        throw new appError_1.default(501, `Invoice generation failed: ${err.message}`);
    }
};
exports.generateInvoice = generateInvoice;
