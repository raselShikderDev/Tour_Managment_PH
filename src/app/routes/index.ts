import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { authRoutes } from "../modules/auth/auth.route";
import { divisionRouter } from "../modules/divisions/division.route";

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
    // {
    //     path:"/tours",
    //     route:userRoutes
    // },
    {
        path:"/division",
        route:divisionRouter,
    },

]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})
