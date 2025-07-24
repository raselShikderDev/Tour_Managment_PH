/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { IPayment } from "./payment.interfce";

// Creating Payment
const successPayment = async (payload:IPayment) => {
  if (!payload) {
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Payments's infromation not found"
    );
  }

  const newPayment = null
  return newPayment;
};

// Retriving all tours
const   failPayment = async () => {
  const totalPayment = null

  const allPayment = null
  console.log("No Payment created yet");
  return {
    meta: {
      total: totalPayment,
    },
    data: allPayment,
  };
};

// Get singel a Payment by id
const cancelPayment = async () => {
  const Payment = null
  if (Payment === null) throw new appError(StatusCodes.NOT_FOUND, "Tour not found");
  return Payment;
};





export const paymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
};
