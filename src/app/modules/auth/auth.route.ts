import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()

router.post("/login", authController.credentialsLogin)
router.post("/refresh-token", authController.getNewAccessToken)
router.post("/logout", authController.logoutUser)

export const authRoutes = router