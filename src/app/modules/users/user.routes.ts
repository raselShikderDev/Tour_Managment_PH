/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Response, Request, NextFunction } from "express";
import { userCcontroller } from "./user.controller";
import { createZodValidation } from "./user.validation";
import { AnyZodObject } from "zod";
import { validateRequest } from "../../middleware/validateRequest";




const router = Router();

router.get("/", userCcontroller.getAllUsers);
router.post("/register", validateRequest(createZodValidation), userCcontroller.createUser);

export const userRoutes = router;
