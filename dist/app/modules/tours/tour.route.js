"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourRouter = void 0;
const express_1 = require("express");
const tour_controller_1 = require("./tour.controller");
const validateRequest_1 = require("../../middleware/validateRequest");
const tour_zodValidation_1 = require("./tour.zodValidation");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../users/user.interface");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
/**--------------------------- Tour types Routes -------------------------- */
// Create a tourType
router.post("/create-tour-type", (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(tour_zodValidation_1.createTourTypeZodSchema), tour_controller_1.tourTypeController.createTourType);
// Get all touType
router.get("/tour-types", (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), tour_controller_1.tourTypeController.getAllTourType);
// Get singel tourType by id
router.get("tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), tour_controller_1.tourTypeController.getSingelTourType);
router.delete("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), tour_controller_1.tourTypeController.deleteTourType);
router.patch("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(tour_zodValidation_1.createTourTypeZodSchema), tour_controller_1.tourTypeController.updateTourType);
/**------------------------------ Tour Routes -------------------------------- */
// Create a tour
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validateRequest_1.validateRequest)(tour_zodValidation_1.createTourZodSchema), tour_controller_1.tourController.createTour);
//Get all tours
router.get("/", 
// checkAuth(...Object.values(role)),
tour_controller_1.tourController.getAllTour);
//Get singel tour by slug
router.get("/:slug", 
// checkAuth(...Object.values(role)),
tour_controller_1.tourController.getSingelTour);
// Delete a tour
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), tour_controller_1.tourController.deleteTour);
// Update a tour
router.patch("/:id", multer_config_1.multerUpload.array("files"), (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(tour_zodValidation_1.updateTourZodSchema), tour_controller_1.tourController.updateTour);
exports.tourRouter = router;
