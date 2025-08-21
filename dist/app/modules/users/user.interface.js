"use strict";
// User: // name: String // email: String (unique) // password: String // role: String (e.g., Admin, User) // phone: String // picture: String // address: String // isDeleted: Boolean // isActive: String (e.g., Active, Inactive) // isVerified: Boolean // auths: Array of auth providers (e.g., Google, Facebook)
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActive = exports.role = void 0;
var role;
(function (role) {
    role["USER"] = "USER";
    role["ADMIN"] = "ADMIN";
    role["SUPER_ADMIN"] = "SUPER_ADMIN";
    role["GUIDE"] = "GUIDE";
})(role || (exports.role = role = {}));
var isActive;
(function (isActive) {
    isActive["ACTIVE"] = "ACTIVE";
    isActive["INACTIVE"] = "INACTIVE";
    isActive["BLOCKED"] = "BLOCKED";
})(isActive || (exports.isActive = isActive = {}));
