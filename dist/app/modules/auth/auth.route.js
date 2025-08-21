"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../users/user.interface");
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../config/env");
const validateRequest_1 = require("../../middleware/validateRequest");
const auth_zodSchema_1 = require("./auth.zodSchema");
const router = (0, express_1.Router)();
// router.post("/forgot-password", authController.forgotPassword)
router.post("/login", auth_controller_1.authController.credentialsLogin);
router.post("/refresh-token", auth_controller_1.authController.getNewAccessToken);
router.post("/logout", auth_controller_1.authController.logoutUser);
router.post("/forgot-password", (0, validateRequest_1.validateRequest)(auth_zodSchema_1.forgotPasswordZodSchema), auth_controller_1.authController.forgotPassword);
router.post("/chnage-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), auth_controller_1.authController.chnagePassword);
router.post("/set-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), auth_controller_1.authController.setPassword);
router.post("/reset-password", (0, validateRequest_1.validateRequest)(auth_zodSchema_1.resetPasswordZodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), auth_controller_1.authController.resetPassword);
router.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirect = req.query.state || "/";
    passport_1.default.authenticate("google", { scope: ["profile", "email"], state: redirect })(req, res, next);
}));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: `${env_1.envVars.FRONEND_URL}/login?error=` }), auth_controller_1.authController.googleCallback);
exports.authRoutes = router;
