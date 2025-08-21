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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const boooking_model_1 = require("../booking/boooking.model");
const payment_model_1 = require("../payment/payment.model");
const tour_model_1 = require("../tours/tour.model");
const user_interface_1 = require("../users/user.interface");
const user_model_1 = require("../users/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const fifteenDaysAgo = new Date(now).setDate(now.getDate() - 15);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
// Getting all users stats
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const allUsersPromise = user_model_1.userModel.countDocuments();
    // Based on user status
    const allActiveUsersPromise = user_model_1.userModel.countDocuments({
        isActive: user_interface_1.isActive.ACTIVE,
    });
    const allInActiveUsersPromise = user_model_1.userModel.countDocuments({
        isActive: user_interface_1.isActive.INACTIVE,
    });
    const allBockedUsersPromise = user_model_1.userModel.countDocuments({
        isActive: user_interface_1.isActive.BLOCKED,
    });
    // Based on user created date
    const newUserCreatedAtlast7DaysPromise = user_model_1.userModel.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newUserCreatedAtlast15DaysPromise = user_model_1.userModel.countDocuments({
        createdAt: { $gte: fifteenDaysAgo },
    });
    const newUserCreatedAtlast30DaysPromise = user_model_1.userModel.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    // Based one user role
    const usersByRolePromise = user_model_1.userModel.aggregate([
        // stage - 1 : Grouping based on user role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [allUsers, allActiveUsers, allInActiveUsers, allBockedUsers, newUserCreatedAtlast7Days, newUserCreatedAtlast15Days, newUserCreatedAtlast30Days, usersByRole,] = yield Promise.all([
        allUsersPromise,
        allActiveUsersPromise,
        allInActiveUsersPromise,
        allBockedUsersPromise,
        newUserCreatedAtlast7DaysPromise,
        newUserCreatedAtlast15DaysPromise,
        newUserCreatedAtlast30DaysPromise,
        usersByRolePromise,
    ]);
    return {
        allUsers,
        allActiveUsers,
        allInActiveUsers,
        allBockedUsers,
        newUserCreatedAtlast7Days,
        newUserCreatedAtlast15Days,
        newUserCreatedAtlast30Days,
        usersByRole,
    };
});
const getTourStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalToursPromise = tour_model_1.tourModel.countDocuments();
    const tourByTourTypepromise = tour_model_1.tourModel.aggregate([
        // stage - 1 : popolating tourtype by Lookup
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type",
            },
        },
        // Stage - 2 : unwind
        {
            $unwind: "$type",
        },
        // stage - 3 : Grouping
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const avgTourCostPromise = tour_model_1.tourModel.aggregate([
        // Stage - 1 : finding avarage of tour cost by Grouping
        {
            $group: {
                _id: null,
                avarageCost: { $avg: "$costForm" },
            },
        },
        // stage -1 : showing only avarage cost of tour
        {
            $project: {
                _id: 0,
                avarageCost: 1,
            },
        },
    ]);
    const totalTourByDivisionPromise = tour_model_1.tourModel.aggregate([
        // Stage 1: Connect / Populate division to tour by lookup
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division",
            },
        },
        // Stage 2: unwind array to object
        {
            $unwind: { path: "$division", preserveNullAndEmptyArrays: true },
        },
        // Stage 3: Grouping tourType
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalhighestBookedtourPromise = boooking_model_1.bookingModel.aggregate([
        // Stage 1: Grouping tour
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 },
            },
        },
        // Stage 2 sort the tour
        {
            $sort: { bookingCount: -1 },
        },
        // Stage 3 limiting the tour
        {
            $limit: 5,
        },
        // stage 4 - lookup / connect
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] },
                        },
                    },
                ],
                as: "tour",
            },
        },
        // stage  5
        {
            $unwind: "$tour",
        },
        // Stage - 6
        {
            $project: {
                bookingCount: 1,
                "tour.slug": 1,
                "tour.title": 1,
            },
        },
    ]);
    const [totalTours, tourByTourType, avgTourCost, totalTourByDivision, totalhighestBookedtour,] = yield Promise.all([
        totalToursPromise,
        tourByTourTypepromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        totalhighestBookedtourPromise,
    ]);
    return {
        totalTours,
        tourByTourType,
        avgTourCost,
        totalTourByDivision,
        totalhighestBookedtour,
    };
});
const getBookingStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalBookingPromise = boooking_model_1.bookingModel.countDocuments();
    const totalBookingByStatusPromise = boooking_model_1.bookingModel.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const bookingsPerTourPromise = boooking_model_1.bookingModel.aggregate([
        // stage-1 : Grouping all tour
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 },
            },
        },
        // stage-2 : sorting
        {
            $sort: {
                bookingCount: -1,
            },
        },
        // Stage-3: Limiting
        {
            $limit: 10,
        },
        // stage-4: Lookup
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour",
            },
        },
        // Stage-5: Unwind
        {
            $unwind: "$tour",
        },
        //stage-6 project
        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1,
            },
        },
    ]);
    const avgGuestCountPerbookingPromise = yield boooking_model_1.bookingModel.aggregate([
        //Stage-1: Grouping all booking
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" },
            },
        },
        // Stage-2 Projection
        {
            $project: {
                _id: 0,
                avgGuestCount: 1,
            }
        }
    ]);
    const last7DaysBookingPromise = boooking_model_1.bookingModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const last15DaysBookingPromise = boooking_model_1.bookingModel.countDocuments({ createdAt: { $gte: fifteenDaysAgo } });
    const last30DaysBookingPromise = boooking_model_1.bookingModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const totalBookingByUniqeUsersPromise = boooking_model_1.bookingModel.distinct("user").then((user) => user.length);
    const [totalBooking, totalBookingByStatus, bookingsPerTour, avgGuestCountPerbooking, last7DaysBooking, last15DaysBooking, last30DaysBooking, totalBookingByUniqeUsers] = yield Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        bookingsPerTourPromise,
        avgGuestCountPerbookingPromise[0].avgGuestCount,
        last7DaysBookingPromise,
        last15DaysBookingPromise,
        last30DaysBookingPromise,
        totalBookingByUniqeUsersPromise,
    ]);
    return {
        totalBooking,
        totalBookingByStatus,
        bookingsPerTour,
        avgGuestCountPerbooking,
        last7DaysBooking,
        last15DaysBooking,
        last30DaysBooking,
        totalBookingByUniqeUsers
    };
});
const getPaymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPaymentPromise = payment_model_1.paymentModel.countDocuments();
    const totalPaymentByStatusPromise = payment_model_1.paymentModel.aggregate([
        //Stage 1: group by stauts
        {
            $group: {
                _id: "$status",
                total: { $sum: 1 }
            }
        },
    ]);
    const totalPaymentAmountByStatusPromise = payment_model_1.paymentModel.aggregate([
        //Stage 1: group by stauts
        {
            $group: {
                _id: "$status",
                totalAmount: { $sum: "$amount" }
            }
        },
    ]);
    const avgPaymentAmountPromise = payment_model_1.paymentModel.aggregate([
        //Stage 1: group by stauts
        {
            $group: {
                _id: null,
                avgAmount: { $sum: "$amount" }
            }
        },
    ]);
    const paymentGatewayDataPromise = payment_model_1.paymentModel.aggregate([
        // stage-1: Grouping
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalPayment, totalPaymentByStatus, totalPaymentAmountByStatus, avgPaymentAmount, paymentGatewayData] = yield Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalPaymentAmountByStatusPromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise,
    ]);
    return { totalPayment, totalPaymentByStatus, totalPaymentAmountByStatus, avgPaymentAmount, paymentGatewayData };
});
exports.StatsService = {
    getBookingStats,
    getPaymentStats,
    getTourStats,
    getUserStats,
};
