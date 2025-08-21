"use strict";
// User -> Booking (Pending) -> Payment (unpaid) -> SSLCommerz -> Booking status chnage to Confrim -> Payment status chnage to paid ->
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOOKING_STATUS = void 0;
var BOOKING_STATUS;
(function (BOOKING_STATUS) {
    BOOKING_STATUS["PENDING"] = "PENDING";
    BOOKING_STATUS["COMPLETED"] = "COMPLETED";
    BOOKING_STATUS["FAILD"] = "FAILD";
    BOOKING_STATUS["CANCELED"] = "CANCELED";
})(BOOKING_STATUS || (exports.BOOKING_STATUS = BOOKING_STATUS = {}));
