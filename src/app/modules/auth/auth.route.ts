/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
    const redirect = req.query.state as string || "/"
    passport.authenticate("google", {scope:["profile", "email"], state:redirect as string})(req, res, next)
})
router.get("/google/callback",passport.authenticate("google", {failureRedirect:"/login"}), async(req:Request, res:Response, next:NextFunction)=>{
    console.log(`Request Recived in middleware`);
    console.log(`params in middleware: ${req.params}`);
    console.log(`req object in middleware: ${req}`);
    next()
}, authController.googleCallback)


export const authRoutes = router
