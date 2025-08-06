import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { authRoutes } from "../modules/auth/auth.route";
import { divisionRouter } from "../modules/divisions/division.route";
import { tourRouter } from "../modules/tours/tour.route";
import { bookingRouter } from "../modules/booking/booking.route";
import { paymentRouter } from "../modules/payment/payment.route";

export const router = Router()

const moduleRoutes = [
    {
        path:"/user",
        route:userRoutes
    },
    {
        path:"/auth",
        route:authRoutes
    },
    {
        path:"/tour",
        route:tourRouter,
    },
    {
        path:"/division",
        route:divisionRouter,
    },
    {
        path:"/booking",
        route:bookingRouter,
    },
    {
        path:"/payment",
        route:paymentRouter,
    },

]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})
