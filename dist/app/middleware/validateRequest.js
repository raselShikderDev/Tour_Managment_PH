"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const env_1 = require("../config/env");
const validateRequest = (zodSchema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_1.envVars.NODE_ENV === "Development")
        console.log(`in validateReq - req.body: `, req.body);
    if (req.body.data) {
        if (env_1.envVars.NODE_ENV === "Development")
            console.log(`in validateReq - req.body.data: `, req.body.data);
        req.body = JSON.parse(req.body.data);
    }
    req.body = yield zodSchema.parseAsync(req.body);
    if (env_1.envVars.NODE_ENV === "Development")
        console.log(`in validateReq after validation - payload: `, req.body);
    next();
});
exports.validateRequest = validateRequest;
