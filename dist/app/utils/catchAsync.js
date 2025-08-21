"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        if (env_1.envVars.NODE_ENV === "Development") {
            console.log(err);
        }
        next(err);
    });
};
exports.default = catchAsync;
