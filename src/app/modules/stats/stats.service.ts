import { bookingModel } from "../booking/boooking.model";
import { tourModel } from "../tours/tour.model";
import { isActive } from "../users/user.interface";
import { userModel } from "../users/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const fifteenDaysAgo = new Date(now).setDate(now.getDate() - 15);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

// Getting all users stats
const getUserStats = async () => {
  const allUsersPromise = userModel.countDocuments();

  // Based on user status
  const allActiveUsersPromise = userModel.countDocuments({
    isActive: isActive.ACTIVE,
  });
  const allInActiveUsersPromise = userModel.countDocuments({
    isActive: isActive.INACTIVE,
  });
  const allBockedUsersPromise = userModel.countDocuments({
    isActive: isActive.BLOCKED,
  });

  // Based on user created date
  const newUserCreatedAtlast7DaysPromise = userModel.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUserCreatedAtlast15DaysPromise = userModel.countDocuments({
    createdAt: { $gte: fifteenDaysAgo },
  });
  const newUserCreatedAtlast30DaysPromise = userModel.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Based one user role
  const usersByRolePromise = userModel.aggregate([
    // stage - 1 : Grouping based on user role
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    allUsers,
    allActiveUsers,
    allInActiveUsers,
    allBockedUsers,
    newUserCreatedAtlast7Days,
    newUserCreatedAtlast15Days,
    newUserCreatedAtlast30Days,
    usersByRole,
  ] = await Promise.all([
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
};

const getTourStats = async () => {
  const totalToursPromise = tourModel.countDocuments();

  const tourByTourTypepromise = tourModel.aggregate([
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

  const avgTourCostPromise = tourModel.aggregate([
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

  const totalTourByDivisionPromise = tourModel.aggregate([
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

  const totalhighestBookedtourPromise = bookingModel.aggregate([
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

  const [
    totalTours,
    tourByTourType,
    avgTourCost,
    totalTourByDivision,
    totalhighestBookedtour,
  ] = await Promise.all([
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
};

const getBookingStats = async () => {
  const totalBookingPromise = bookingModel.countDocuments();
  const totalBookingByStatusPromise = bookingModel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const bookingsPerTourPromise = bookingModel.aggregate([
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

  const avgGuestCountPerbookingPromise = await bookingModel.aggregate([
    //Stage-1: Grouping all booking
    {
      $group: {
        _id: null,
        avgGuestCount: { $avg: "$guestCount" },
      },
    },
    // Stage-2 Projection
    {
      $project:{
        _id:0,
        avgGuestCount:1,
      }
    }
  ]);

  const last7DaysBookingPromise = bookingModel.countDocuments({createdAt:{$gte:sevenDaysAgo}})
  const last15DaysBookingPromise = bookingModel.countDocuments({createdAt:{$gte:fifteenDaysAgo}})
  const last30DaysBookingPromise = bookingModel.countDocuments({createdAt:{$gte:thirtyDaysAgo}})

  const totalBookingByUniqeUsersPromise = bookingModel.distinct("user").then((user)=>user.length)

  const [
    totalBooking,
    totalBookingByStatus,
    bookingsPerTour,
    avgGuestCountPerbooking,
    last7DaysBooking,
    last15DaysBooking,
    last30DaysBooking,
    totalBookingByUniqeUsers
  ] = await Promise.all([
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
};

const getPaymentStats = async () => {
  return {};
};

export const StatsService = {
  getBookingStats,
  getPaymentStats,
  getTourStats,
  getUserStats,
};
