import { Router } from "express";


import { checkAuth } from "../../middleware/checkAuth";
import { role } from "../users/user.interface";
import { paymentController } from "./payment.controller";
const router = Router();


router.post("/success",checkAuth(...Object.values(role)), paymentController.successPayment)
router.post("/fail")
router.post("/cancel")



export const paymentRouter = router;
