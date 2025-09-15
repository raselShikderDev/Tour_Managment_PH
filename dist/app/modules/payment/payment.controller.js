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
exports.paymentController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const payment_services_1 = require("./payment.services");
const env_1 = require("../../config/env");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const sslcommerce_service_1 = require("../sslcommerz/sslcommerce.service");
// Initial Payment
const initPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingid = req.params.bookingid;
    const result = yield payment_services_1.paymentServices.initPayment(bookingid);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
}));
//Success Payment
const successPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_services_1.paymentServices.successPayment(query);
    if (result === null || result === void 0 ? void 0 : result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=success$`);
    }
}));
//Fail Payment
const failPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_services_1.paymentServices.successPayment(query);
    if (result === null || result === void 0 ? void 0 : result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=fail$`);
    }
}));
//Cancel Payment
const cancelPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_services_1.paymentServices.successPayment(query);
    if (result === null || result === void 0 ? void 0 : result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=cancel$`);
    }
}));
// get singel Payment's invoice url
const SinglepaymentInvoiceUrl = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentId = req.params.paymentid;
    const decodedToken = req.user;
    const result = yield payment_services_1.paymentServices.SinglepaymentInvoiceUrl(paymentId, decodedToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Invoice successfully retrived ",
        data: result,
    });
}));
// get all Payment's invoice url - only admins are allowed
const invoicesAllpayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_services_1.paymentServices.invoicesAllpayment();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All invoice successfully retrived ",
        data: result,
    });
}));
const validatePayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line no-console
    console.log(`SSL req.body: ${req.body}`);
    const result = yield sslcommerce_service_1.sslServicess.PaymentValidator(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Payment successfully verified",
        data: result,
    });
}));
exports.paymentController = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    validatePayment,
    SinglepaymentInvoiceUrl,
    invoicesAllpayment,
};
