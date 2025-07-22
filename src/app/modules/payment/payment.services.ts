/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { IPayment } from "./payment.interfce";

// Creating Payment
const createPayment = async (payload:IPayment) => {
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
const getAllPayment = async () => {
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
const getSingelPayment = async (id: string) => {
  const Payment = null
  if (Payment === null) throw new appError(StatusCodes.NOT_FOUND, "Tour not found");
  return Payment;
};


// Deleting a Payment
const deletePayment = async (id: string) => {
  const deletedAPayment = null
  if (!deletePayment)
    throw new appError(StatusCodes.NOT_FOUND, "Payment not found");
  return deletedAPayment;
};

// Updating Payment
const updatePayment = async (id: string, payload:Partial<IPayment>) => {
  if (!payload)
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Payment's updated infromation not found"
    );

  const isExist = null
  if (!isExist) {
    throw new appError(StatusCodes.NOT_FOUND, "Payment not found");
  }

  const isDuplicate =null
  if (isDuplicate !== null) {
    throw new appError(
      StatusCodes.BAD_REQUEST,
      "A Payment with this title already exists"
    );
  }

  const updatedNewPayment = null
  if (!updatedNewPayment)
    throw new appError(StatusCodes.NOT_FOUND, "Payment not found");

  return updatedNewPayment;
};

export const paymentServices = {
  createPayment,
  getAllPayment,
  deletePayment,
  updatePayment,
  getSingelPayment
};
