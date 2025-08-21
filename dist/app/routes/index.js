"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/users/user.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const division_route_1 = require("../modules/divisions/division.route");
const tour_route_1 = require("../modules/tours/tour.route");
const booking_route_1 = require("../modules/booking/booking.route");
const payment_route_1 = require("../modules/payment/payment.route");
const otp_route_1 = require("../modules/otp/otp.route");
const stats_route_1 = require("../modules/stats/stats.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.userRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes
    },
    {
        path: "/tour",
        route: tour_route_1.tourRouter,
    },
    {
        path: "/division",
        route: division_route_1.divisionRouter,
    },
    {
        path: "/booking",
        route: booking_route_1.bookingRouter,
    },
    {
        path: "/payment",
        route: payment_route_1.paymentRouter,
    },
    {
        path: "/otp",
        route: otp_route_1.otpRouter,
    },
    {
        path: "/stats",
        route: stats_route_1.statsRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
