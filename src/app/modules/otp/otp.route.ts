import { Router } from "express";
import { otpController } from "./otp.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { verifyOtpZodSchema } from "./otp.zodSchema";

const router = Router();

router.post("/send", otpController.sendOtp);
router.post(
  "/verify",
  validateRequest(verifyOtpZodSchema),
  otpController.verifyOtp
);

export const otpRouter = router;
