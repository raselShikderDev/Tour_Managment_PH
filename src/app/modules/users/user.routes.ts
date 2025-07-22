/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Response, Request, NextFunction } from "express";
import { userCcontroller } from "./user.controller";
import { createZodValidation, paramsSchema, updateUserZodValidation } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { role } from "./user.interface";

const router = Router();



router.get(
  "/all-users",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  userCcontroller.getAllUsers
);

// user register route
router.post(
  "/register",
  validateRequest(createZodValidation),
  userCcontroller.createUser
);

// user update route
router.patch("/:userId", validateRequest(paramsSchema), validateRequest(updateUserZodValidation), checkAuth(...Object.values(role)), userCcontroller.updateUser);


// Delete user
router.delete("/:userId", validateRequest(paramsSchema), checkAuth(role.ADMIN, role.SUPER_ADMIN), userCcontroller.getAllUsers)

// Get singel user
router.get("/:userId", checkAuth(role.ADMIN, role.SUPER_ADMIN), userCcontroller.getSingelUser)

//

export const userRoutes = router;
