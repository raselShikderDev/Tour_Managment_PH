"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRouter = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../users/user.interface");
const validateRequest_1 = require("../../middleware/validateRequest");
const boooking_controller_1 = require("./boooking.controller");
const booking_zodValidation_1 = require("./booking.zodValidation");
const router = (0, express_1.Router)();
// Create a bookings
router.post("/create", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), (0, validateRequest_1.validateRequest)(booking_zodValidation_1.createBookingZodSchema), boooking_controller_1.bookingController.createBooking);
//Get all bookingss
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), boooking_controller_1.bookingController.getAllBooking);
//Get user bookings  
router.get("/my-booking", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), boooking_controller_1.bookingController.myBookings);
//Get user completed bookings  
router.get("/completed-booking", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), boooking_controller_1.bookingController.myCompletedBookings);
//Get user pending bookings  
router.get("/pending-booking", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), boooking_controller_1.bookingController.myPendingsBookings);
//Get singel bookings by id
router.get("/:bookingid", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), boooking_controller_1.bookingController.getSingelBooking);
// Delete a bookings
router.delete("/:bookingId", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), boooking_controller_1.bookingController.deleteBooking);
// Update a bookings
router.patch("/:bookingId/status", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), (0, validateRequest_1.validateRequest)(booking_zodValidation_1.updateBookingZodSchema), boooking_controller_1.bookingController.updateBooking);
exports.bookingRouter = router;
