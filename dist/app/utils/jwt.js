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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.GenerateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GenerateAccessToken = (jwtPayload, secret, expires) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, secret, { expiresIn: expires });
    return accessToken;
});
exports.GenerateAccessToken = GenerateAccessToken;
const verifyJwtToken = (accessToken, secret) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToekn = yield jsonwebtoken_1.default.verify(accessToken, secret);
    return verifiedToekn;
});
exports.verifyJwtToken = verifyJwtToken;
// export const CompareJwtToken = async (password:string, existingPassword:string)=>{
//     const comparePassword = bcrypt.compare(password, existingPassword)
//     return comparePassword
// }
