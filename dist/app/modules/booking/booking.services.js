"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
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
exports.bookingServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const booking_interface_1 = require("./booking.interface");
const user_model_1 = require("../users/user.model");
const tour_model_1 = require("../tours/tour.model");
const boooking_model_1 = require("./boooking.model");
const payment_model_1 = require("../payment/payment.model");
const payment_interfce_1 = require("../payment/payment.interfce");
const sslcommerce_service_1 = require("../sslcommerz/sslcommerce.service");
const getTransaction_1 = require("../../utils/getTransaction");
// Creating Booking
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield boooking_model_1.bookingModel.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.userModel.findById(userId);
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !user.address) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Please update your profile to book a tour");
        }
        const tour = yield tour_model_1.tourModel.findById(payload.tour).select("costForm");
        if (!tour || typeof tour.costForm !== "number") {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No valid cost found for this tour");
        }
        if (!tour) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No tour cost found");
        }
        // console.log("tourCost: ", tour.costForm);
        // console.log("payload.guestCount: ", payload.guestCount);
        const amount = Number(tour.costForm) * Number(payload.guestCount);
        // console.log(`Amount: ${amount}`);
        const transId = (0, getTransaction_1.generateTransactionId)(userId);
        const booking = yield boooking_model_1.bookingModel.create([
            Object.assign({ user: userId, status: booking_interface_1.BOOKING_STATUS.PENDING }, payload),
        ], { session });
        const payment = yield payment_model_1.paymentModel.create([{
                booking: booking[0]._id,
                status: payment_interfce_1.PAYMENT_STATUS.UNPAID,
                transactionId: transId,
                amount: amount,
            }], { session });
        const updatedBooking = yield boooking_model_1.bookingModel
            .findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, { new: true, runValidators: true, session })
            .populate("user", "name email phone address")
            .populate("tour", "title costForm")
            .populate("payment");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userEmail = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userName = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).name;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userAddress = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).address;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userPhone = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).phoneNumber;
        const sslPaylaod = {
            amount: Number(amount),
            transactionId: transId,
            name: userName,
            email: userEmail,
            phoneNumber: userPhone,
            address: userAddress,
        };
        const sslPayment = yield sslcommerce_service_1.sslServicess.sslPaymentInit(sslPaylaod);
        // console.log("sslPayment: ", sslPayment);
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: updatedBooking,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// Retriving all tours
const getAllBooking = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        meta: {
            total: null,
        },
        data: null,
    };
});
// Get singel a Booking by id
const getSingelBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const Booking = null;
    return Booking;
});
// Deleting a Booking
const deleteBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedABooking = null;
    if (!deleteBooking)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Booking not found");
    return deletedABooking;
});
// Updating Booking
const updateBooking = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Booking's updated infromation not found");
    const isExist = null;
    if (!isExist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Booking not found");
    }
    const isDuplicate = null;
    if (isDuplicate !== null) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "A Booking with this title already exists");
    }
    const updatedNewBooking = null;
    if (!updatedNewBooking)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Booking not found");
    return updatedNewBooking;
});
exports.bookingServices = {
    createBooking,
    getAllBooking,
    deleteBooking,
    updateBooking,
    getSingelBooking,
};
