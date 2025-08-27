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
import { multerUpload } from "../../config/multer.config";

const router = Router();

/**--------------------------- Tour types Routes -------------------------- */
// Create a tourType
router.post(
  "/create-tour-type",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourTypeController.createTourType
);
// Get all touType
router.get(
  "/tour-types",
  checkAuth(...Object.values(role)),
  tourTypeController.getAllTourType
);
// Get singel tourType by id
router.get(
  "tour-types/:id",
  // checkAuth(role.ADMIN, role.SUPER_ADMIN),
  tourTypeController.getSingelTourType
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
// Create a tour
router.post(
  "/create",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(createTourZodSchema),
  tourController.createTour
);
//Get all tours
router.get(
  "/",
  // checkAuth(...Object.values(role)),
  tourController.getAllTour
);
//Get singel tour by slug
router.get(
  "/:slug",
  // checkAuth(...Object.values(role)),
  tourController.getSingelTour
);

// Delete a tour
router.delete(
  "/:id",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  tourController.deleteTour
);
// Update a tour
router.patch(
  "/:id",
  multerUpload.array("files"),
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  validateRequest(updateTourZodSchema),
  tourController.updateTour
);

export const tourRouter = router;
