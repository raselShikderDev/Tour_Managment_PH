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
    const totalToursPromise = tourModel.countDocuments()

    const tourByTourTypepromise = tourModel.aggregate([
        // stage - 1 : popolating tourtype by Lookup
        {
            $lookup:{
                from:"TourTypes",
                localField:"tourType",
                foreignField:"_id",
                as:"type"
            }
        },
        // Stage - 2 : unwind
        {
            $unwind:"$type"
        },
        // stage - 3 : Grouping
        {
            $group:{
                _id:"$type.name",
                count:{$sum:1}
            }
        }
    ])

    const [totalTours, tourByTourType] = await Promise.all([
        totalToursPromise,
        tourByTourTypepromise,
    ])
  return {totalTours, tourByTourType};
};


const getBookingStats = async () => {
  return {};
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
