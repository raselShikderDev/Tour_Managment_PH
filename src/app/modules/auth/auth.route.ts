import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { role } from "../users/user.interface";

const router = Router()

router.post("/login", authController.credentialsLogin)
router.post("/refresh-token", authController.getNewAccessToken)
router.post("/logout", authController.logoutUser)
router.post("/reset-password", checkAuth(...Object.values(role)), authController.resetPassword)


export const authRoutes = router
