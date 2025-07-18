import { Router } from "express";
import { tourController, tourTypeController } from "./tour.controller";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
  updateTourZodSchema,
} from "./tour.zodValidation";
import { checkAuth } from "../../middleware/checkAuth";
import { role } from "../users/user.interface";
const router = Router();



/**--------------------------- Tour types Routes -------------------------- */
router.post(
  "/create-tour-type",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourTypeController.createTourType
);
router.get(
  "/tour-types",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  tourTypeController.getAllTourType
);
router.delete(
  "/tour-types/:id",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  tourTypeController.deleteTourType
);
router.patch(
  "/tour-types/:id",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourTypeController.updateTourType
);


/**------------------------------ Tour Routes -------------------------------- */
router.post(
  "/create",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  tourController.createTour
);
router.get(
  "/",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  tourController.getAllTour
);
router.delete(
  "/:id",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  tourController.deleteTour
);
router.patch(
  "/:id",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  validateRequest(updateTourZodSchema),
  tourController.updateTour
);

export const tourRouter = router;
