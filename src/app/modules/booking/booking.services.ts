/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { Ibooking } from "./booking.interface";


// Creating Booking
const createBooking = async (payload:Ibooking) => {
  if (!payload) {
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Bookings's infromation not found"
    );
  }

  const newBooking = null
  return newBooking;
};

// Retriving all tours
const getAllBooking = async () => {
  const totalBooking = null

  const allBooking = null
  console.log("No Booking created yet");
  return {
    meta: {
      total: totalBooking,
    },
    data: allBooking,
  };
};

// Get singel a Booking by id
const getSingelBooking = async (id: string) => {
  const Booking = null
  if (Booking === null) throw new appError(StatusCodes.NOT_FOUND, "Tour not found");
  return Booking;
};


// Deleting a Booking
const deleteBooking = async (id: string) => {
  const deletedABooking = null
  if (!deleteBooking)
    throw new appError(StatusCodes.NOT_FOUND, "Booking not found");
  return deletedABooking;
};

// Updating Booking
const updateBooking = async (id: string, payload:Partial<Ibooking>) => {
  if (!payload)
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Booking's updated infromation not found"
    );

  const isExist = null
  if (!isExist) {
    throw new appError(StatusCodes.NOT_FOUND, "Booking not found");
  }

  const isDuplicate =null
  if (isDuplicate !== null) {
    throw new appError(
      StatusCodes.BAD_REQUEST,
      "A Booking with this title already exists"
    );
  }

  const updatedNewBooking = null
  if (!updatedNewBooking)
    throw new appError(StatusCodes.NOT_FOUND, "Booking not found");

  return updatedNewBooking;
};

export const bookingServices = {
  createBooking,
  getAllBooking,
  deleteBooking,
  updateBooking,
  getSingelBooking
};
