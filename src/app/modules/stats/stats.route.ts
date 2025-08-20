import { Router } from "express";

import { StatsController } from "./stats.controller";
import { role } from "../users/user.interface";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();



router.get(
  "/users",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  StatsController.getUserStats
);
router.get(
  "/payments",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  StatsController.getPaymentStats
);
router.get(
  "/bookings",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  StatsController.getBookingStats
);
router.get(
  "/tours",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  StatsController.getTourStats
);






export const statsRoutes = router;
