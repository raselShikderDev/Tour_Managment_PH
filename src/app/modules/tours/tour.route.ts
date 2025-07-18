import {Router} from "express"
import { tourController } from "./tour.controller"
import { validateRequest } from "../../middleware/validateRequest"
import { createTourZodSchema } from "./tour.zodValidation"
const router = Router()

router.post("/create", validateRequest(createTourZodSchema), tourController.createTour)
router.get("/", tourController.getAllTour)
router.delete("/:id", tourController.deleteTour)
router.patch("/:id", validateRequest(createTourZodSchema), tourController.updateTour)

export const tourRouter = router