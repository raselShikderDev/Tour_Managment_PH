/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";


import { checkAuth } from "../../middleware/checkAuth";
import { role } from "../users/user.interface";
const router = Router();



// // Create a tour
// router.post(
//   "/create",
//   checkAuth(role.ADMIN, role.SUPER_ADMIN),
//   validateRequest(createTourZodSchema),
//   tourController.createTour
// );
// //Get all tours
// router.get(
//   "/",
//   checkAuth(role.ADMIN, role.SUPER_ADMIN),
//   tourController.getAllTour
// );
// //Get singel tour by slug
// router.get("/:slug", checkAuth(role.ADMIN, role.SUPER_ADMIN), tourController.getSingelTour)

// // Delete a tour
// router.delete(
//   "/:id",
//   checkAuth(role.ADMIN, role.SUPER_ADMIN),
//   tourController.deleteTour
// );
// // Update a tour
// router.patch(
//   "/:id",
//   checkAuth(role.ADMIN, role.SUPER_ADMIN),
//   validateRequest(updateTourZodSchema),
//   tourController.updateTour
// );

export const paymentRouter = router;
