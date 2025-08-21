"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.default.Schema({
    provider: {
        type: String,
        required: true,
    },
    providerId: {
        type: String,
        required: true,
    }
}, {
    versionKey: false,
    _id: false,
});
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    role: {
        type: String,
        enum: Object.values(user_interface_1.role),
        default: user_interface_1.role.USER
    },
    phone: String,
    picture: String,
    address: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.isActive),
        default: user_interface_1.isActive.ACTIVE
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    auths: {
        type: [authProviderSchema]
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.userModel = mongoose_1.default.model("Users", userSchema);
