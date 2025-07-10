import { Router } from "express";
import { userCcontroller } from "./user.controller";

const router = Router()


router.post("/register", userCcontroller.createUser)


export const userRoutes = router 