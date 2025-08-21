import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { role } from "../users/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";
import { validateRequest } from "../../middleware/validateRequest";
import { forgotPasswordZodSchema, resetPasswordZodSchema } from "./auth.zodSchema";

const router = Router()
// router.post("/forgot-password", authController.forgotPassword)
router.post("/login", authController.credentialsLogin)
router.post("/refresh-token", authController.getNewAccessToken)
router.post("/logout", authController.logoutUser)
router.post("/forgot-password", validateRequest(forgotPasswordZodSchema), authController.forgotPassword)
router.post("/chnage-password", checkAuth(...Object.values(role)), authController.chnagePassword)
router.post("/set-password", checkAuth(...Object.values(role)), authController.setPassword)
router.post("/reset-password", validateRequest(resetPasswordZodSchema), checkAuth(...Object.values(role)), authController.resetPassword)

router.get("/google", async(req:Request, res:Response, next:NextFunction)=>{
    const redirect = req.query.state as string || "/"
    passport.authenticate("google", {scope:["profile", "email"], state:redirect as string})(req, res, next)
})
router.get("/google/callback",passport.authenticate("google", {failureRedirect:`${envVars.FRONEND_URL}/login?error=`}), authController.googleCallback)


export const authRoutes = router
