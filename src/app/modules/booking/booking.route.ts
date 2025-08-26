
import { Router } from "express";


import { checkAuth } from "../../middleware/checkAuth";
import { role } from "../users/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { bookingController } from "./boooking.controller";
import { createBookingZodSchema, updateBookingZodSchema } from "./booking.zodValidation";
const router = Router();



// Create a bookings
router.post(
  "/create",
  checkAuth(...Object.values(role)),
  validateRequest(createBookingZodSchema),
  bookingController.createBooking
);
//Get all bookingss
router.get(
  "/",
  checkAuth(role.ADMIN, role.SUPER_ADMIN),
  bookingController.getAllBooking
);

//Get user bookings  
router.get("/my-booking", checkAuth(...Object.values(role)), bookingController.myBookings)

//Get singel bookings by id
router.get("/:bookingid", checkAuth(...Object.values(role)), bookingController.getSingelBooking)

// Delete a bookings
router.delete(
  "/:bookingId",
  checkAuth(...Object.values(role)),
  bookingController.deleteBooking
);
// Update a bookings
router.patch(
  "/:bookingId/status",
  checkAuth(...Object.values(role)),
  validateRequest(updateBookingZodSchema),
  bookingController.updateBooking
);

export const bookingRouter = router;
