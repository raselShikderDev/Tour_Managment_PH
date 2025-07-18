import {Router} from "express"
import { divisionController } from "./division.controller"
import { checkAuth } from "../../middleware/checkAuth"
import { role } from "../users/user.interface"
import { validateRequest } from "../../middleware/validateRequest"
import { createDivisionZodValidation, updateDivisionZodValidation } from "./division.zodValidation"

const router = Router()

router.post("/create", checkAuth(role.ADMIN, role.SUPER_ADMIN),validateRequest(createDivisionZodValidation), divisionController.CreateDivision)
router.get("/", checkAuth(role.ADMIN, role.SUPER_ADMIN),divisionController.getAllDivisions)
router.get("/:id", divisionController.deleteDivision)
router.patch("/:id", validateRequest(updateDivisionZodValidation), divisionController.deleteDivision)

export const divisionRouter = router