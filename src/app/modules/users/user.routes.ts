import { Router } from "express";
import { userCcontroller } from "./user.controller";

const router = Router()


router.get("/", userCcontroller.getAllUsers)
router.post("/register", userCcontroller.createUser)


export const userRoutes = router 