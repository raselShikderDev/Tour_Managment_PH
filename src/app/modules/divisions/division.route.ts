/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { role } from "../users/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createDivisionZodValidation,
  updateDivisionZodValidation,
} from "./division.zodValidation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/create",
  multerUpload.single("file"),
  divisionController.CreateDivision
);
// router.post("/create", multerUpload.single("file"), checkAuth(role.ADMIN, role.SUPER_ADMIN),validateRequest(createDivisionZodValidation), divisionController.CreateDivision)
router.get(
  "/",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  divisionController.getAllDivisions
);
router.get(
  "/:slug",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  divisionController.getSingelDivision
);
router.delete(
  "/:id",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  divisionController.deleteDivision
);
router.patch(
  "/:id",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  validateRequest(updateDivisionZodValidation),
  divisionController.updateDivision
);

export const divisionRouter = router;
