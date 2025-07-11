import { Router, Response, Request, NextFunction } from "express";
import { userCcontroller } from "./user.controller";
import { createZodValidation } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import appError from "../../errorHelper/appError";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { role } from "./user.interface";

const router = Router();

router.get(
  "/all-users",
  async (req: Request, res: Response, next: NextFunction) => {

    const accessToken = req.headers.authorization;
    if (!accessToken)
      throw new appError(StatusCodes.BAD_REQUEST, "Acces token not found");

    const verifiedToekn = jwt.verify(
      accessToken,
      "OwnSecretSignatureForJWT"
    ) as JwtPayload;
    if (!verifiedToekn)
      throw new appError(StatusCodes.UNAUTHORIZED, "Token is not valid");

    if (
      verifiedToekn.role !== role.SUPER_ADMIN &&
      verifiedToekn.role !== role.ADMIN
    )
      throw new appError(
        StatusCodes.UNAUTHORIZED,
        "You are not permitted to view this route"
      );
      
    next();
  },
  userCcontroller.getAllUsers
);

// user register route
router.post(
  "/register",
  validateRequest(createZodValidation),
  userCcontroller.createUser
);

// user update route
router.patch("/:email", userCcontroller.updateUser);

export const userRoutes = router;
