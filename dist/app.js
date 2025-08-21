"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const globalError_1 = require("./app/middleware/globalError");
const notFound_1 = __importDefault(require("./app/middleware/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
require("./app/config/passportJs");
const env_1 = require("./app/config/env");
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: env_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.envVars.FRONEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.set("trust proxy", 1);
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.send("Here is he Tour managment Backend");
});
// Handling Global Erro
app.use(globalError_1.globalError);
// Handling not found
app.use(notFound_1.default);
exports.default = app;
