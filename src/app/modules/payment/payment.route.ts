import { Router } from "express";
import { paymentController } from "./payment.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { role } from "../users/user.interface";
const router = Router();


router.post("/init-payment/:bookingId",  paymentController.initPayment)
router.post("/success",  paymentController.successPayment)
router.post("/fail",  paymentController.failPayment)
router.post("/cancel",  paymentController.cancelPayment)
router.get("/invoice/:paymentid", checkAuth(...Object.values(role)), paymentController.cancelPayment)



export const paymentRouter = router;
