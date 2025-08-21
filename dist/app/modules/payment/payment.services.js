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
exports.paymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const boooking_model_1 = require("../booking/boooking.model");
const payment_model_1 = require("./payment.model");
const payment_interfce_1 = require("./payment.interfce");
const booking_interface_1 = require("../booking/booking.interface");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const http_status_codes_1 = require("http-status-codes");
const sslcommerce_service_1 = require("../sslcommerz/sslcommerce.service");
const invoice_1 = require("../../utils/invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const cloudinary_config_1 = require("../../config/cloudinary.config");
// Updating Payment sataus to paid
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // Update Booking status to confirm
    // Update payment status to paid
    // Update payment
    const session = yield boooking_model_1.bookingModel.startSession();
    session.startTransaction();
    try {
        const payment = yield payment_model_1.paymentModel.findOne({ booking: bookingId });
        if (!payment) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Payment is not found");
        }
        const booking = yield boooking_model_1.bookingModel.findById(bookingId);
        const userAddress = (booking === null || booking === void 0 ? void 0 : booking.user).address;
        const userEmail = (booking === null || booking === void 0 ? void 0 : booking.user).email;
        const userPhoneNumber = (booking === null || booking === void 0 ? void 0 : booking.user).phone;
        const userName = (booking === null || booking === void 0 ? void 0 : booking.user).name;
        const sslPaylaod = {
            amount: payment.amount,
            transactionId: payment.transactionId,
            name: userName,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            address: userAddress,
        };
        const sslPayment = yield sslcommerce_service_1.sslServicess.sslPaymentInit(sslPaylaod);
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentUrl: sslPayment.GatewayPageURL,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// Updating Payment sataus to paid
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Update Booking status to confirm
    // Update payment status to paid
    // Update payment
    const session = yield boooking_model_1.bookingModel.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.paymentModel.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interfce_1.PAYMENT_STATUS.PAID }, { runValidators: true, new: true, session: session });
        if (!updatedPayment) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Updating Payment is failed");
        }
        // Update Booking
        const updatedBooking = yield boooking_model_1.bookingModel
            .findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.COMPLETED }, { runValidators: true, new: true, session: session })
            .populate("tour", "title")
            .populate("user", "name email");
        if (!updatedBooking) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Updating booking is failed");
        }
        // Creating pdf and updating pdf
        const invoiceData = {
            bookingDate: updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.createdAt,
            transactionId: updatedPayment.transactionId,
            userName: updatedBooking.user.name,
            tourTitle: updatedBooking.tour.title,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedPayment.amount,
        };
        // Generating pdf
        let generatedPDF;
        try {
            generatedPDF = yield (0, invoice_1.generateInvoice)(invoiceData);
        }
        catch (error) {
            throw new appError_1.default(501, `Generating invoice is failed ${error.message}`);
        }
        // uploading invoice in cloudinary
        const uploadedInvoice = yield (0, cloudinary_config_1.uploadBufferCloudinary)(generatedPDF, "Invoice");
        // console.log(uploadedInvoice);
        // updating invoice urrl to payment
        yield payment_model_1.paymentModel.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: uploadedInvoice.url || uploadedInvoice.secure_url }, { runValidators: true, new: true, session: session });
        // Sending email to user's email
        try {
            yield (0, sendEmail_1.sendEmail)({
                to: updatedBooking.user.email,
                subject: "Paymaynet successfully completed",
                templateName: "paymentCompleted",
                templateData: {
                    name: updatedBooking.user.name,
                    amount: updatedPayment.amount,
                    tourName: updatedBooking.tour.title,
                    transactionId: updatedPayment.transactionId,
                },
                attachments: [
                    {
                        filename: "invoice.pdf",
                        content: generatedPDF,
                        contentType: "application/pdf",
                    },
                ],
            });
        }
        catch (error) {
            throw new appError_1.default(501, `Sending invoice to email is failed ${error.message}`);
        }
        yield session.commitTransaction();
        session.endSession();
        return {
            success: true,
            successfully: "Payment completed successfully",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// Updating Payment sattus to fail
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Update Booking status to confirm
    // Update payment status to paid
    // Update payment
    const session = yield boooking_model_1.bookingModel.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.paymentModel.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interfce_1.PAYMENT_STATUS.FAILD }, { runValidators: true, session: session });
        // Update Booking
        yield boooking_model_1.bookingModel.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.FAILD }, { runValidators: true, session: session });
        session.commitTransaction();
        session.endSession();
        return {
            success: false,
            successfully: "Payment faild",
        };
    }
    catch (error) {
        session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// Updating Payment statu to cancel
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Update Booking status to cancel
    // Update payment status to Unpaid
    // Update payment
    const session = yield boooking_model_1.bookingModel.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.paymentModel.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interfce_1.PAYMENT_STATUS.CANCELED }, { runValidators: true, session: session });
        // Update Booking
        yield boooking_model_1.bookingModel.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.CANCELED }, { runValidators: true, session: session });
        session.commitTransaction();
        session.endSession();
        return {
            success: false,
            successfully: "Payment canceled",
        };
    }
    catch (error) {
        session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// Get singel invoice of an payment
const SinglepaymentInvoiceUrl = (paymentId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const existedBooking = yield boooking_model_1.bookingModel.findOne({ user: decodedToken.userId, payment: paymentId });
    if (existedBooking === null || !existedBooking) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Booking not found");
    }
    // if (existedBooking === null || !existedBooking) {
    //    throw new appError(
    //     StatusCodes.BAD_REQUEST,
    //     "You are not authorized to view this invoice"
    //   );
    // }
    const invoiceUrl = yield payment_model_1.paymentModel.findById(paymentId);
    if (!invoiceUrl) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Payment not completed yet! Invoice not available");
    }
    if (!invoiceUrl.invoiceUrl) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Invoice not found");
    }
    return {
        success: true,
        message: "Invoice os ready to download",
        invoice: invoiceUrl.invoiceUrl,
    };
});
// Get all invoice of payment only admins ar
const invoicesAllpayment = () => __awaiter(void 0, void 0, void 0, function* () {
    const AllinvoiceUrl = yield payment_model_1.paymentModel.find({ invoiceUrl: { $ne: null } }).select("invoiceUrl");
    if (!AllinvoiceUrl || AllinvoiceUrl === null) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Payment completed yet");
    }
    return AllinvoiceUrl;
});
exports.paymentServices = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    SinglepaymentInvoiceUrl,
    invoicesAllpayment,
};
