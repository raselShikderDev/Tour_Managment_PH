/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";


import { checkAuth } from "../../middleware/checkAuth";
import { role } from "../users/user.interface";
const router = Router();


router.post("/success")
router.post("/fail")
router.post("/cancel")



export const paymentRouter = router;
