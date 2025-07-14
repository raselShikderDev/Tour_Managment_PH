import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { role } from "../users/user.interface";
import passport from "passport";

const router = Router()

router.post("/login", authController.credentialsLogin)
router.post("/refresh-token", authController.getNewAccessToken)
router.post("/logout", authController.logoutUser)
router.post("/reset-password", checkAuth(...Object.values(role)), authController.resetPassword)
router.get("/google", async(req:Request, res:Response, next:NextFunction)=>{
    passport.authenticate("google", {scope:["profile", "email"]})(req, res, next)
})
router.get("/goole/callback",passport.authenticate("google", {failureRedirect:"/login"}), authController.googleCallback)


export const authRoutes = router
