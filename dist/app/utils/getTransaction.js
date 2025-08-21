"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = void 0;
// Generating Transaction id with mixture of current date userId and random Number
const generateTransactionId = (id) => {
    return `trxid${Date.now()}${Math.floor(Math.random() * 100)}${id.slice(18)}`;
};
exports.generateTransactionId = generateTransactionId;
