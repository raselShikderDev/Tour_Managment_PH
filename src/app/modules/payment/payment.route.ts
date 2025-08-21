import { Router } from "express";
import { paymentController } from "./payment.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { role } from "../users/user.interface";
const router = Router();

router.post("/success", paymentController.successPayment);
router.post("/fail", paymentController.failPayment);
router.post("/cancel", paymentController.cancelPayment);
router.post("/init-payment/:bookingId", paymentController.initPayment);
router.get(
  "/all-invoices",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  paymentController.invoicesAllpayment
);
router.get(
  "/invoices/:paymentid",
  checkAuth(...Object.values(role)),
  paymentController.SinglepaymentInvoiceUrl
);



export const paymentRouter = router;



