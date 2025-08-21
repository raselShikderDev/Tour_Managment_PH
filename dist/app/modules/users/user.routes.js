"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = require("../../middleware/validateRequest");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("./user.interface");
const router = (0, express_1.Router)();
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), user_controller_1.userCcontroller.getAllUsers);
// Get current user
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), user_controller_1.userCcontroller.getMe);
// user register route
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createZodValidation), user_controller_1.userCcontroller.createUser);
// Get singel user
router.get("/:userId", (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), user_controller_1.userCcontroller.getSingelUser);
// user update route
router.patch("/:userId", (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodValidation), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.role)), user_controller_1.userCcontroller.updateUser);
// Delete user
router.delete("/:userId", (0, checkAuth_1.checkAuth)(user_interface_1.role.ADMIN, user_interface_1.role.SUPER_ADMIN), user_controller_1.userCcontroller.deleteUser);
exports.userRoutes = router;
