// Import the asyncHandler middleware to handle asynchronous operations and errors
import asyncHandler from "express-async-handler";
// Import the Prisma client instance for database operations
import { prisma } from "../config/prismaConfig.js";

/**********************************************************************************************************
 * createUser - An asynchronous function to create a new user.
 * 
 * This function checks if a user with the given email already exists.
 * If the user does not exist, it creates a new user and sends a success message along with the user data.
 * If the user already exists, it sends a message indicating that the user is already registered.
 *
 * @param {Object} req - The request object, containing the user data in the body.
 * @param {Object} res - The response object, used to send the response back to the client.
 **********************************************************************************************************/
export const createUser = asyncHandler(async (req, res) => {
  // Log the action of creating a user
  console.log("creating a user");

  // Extract the email from the request body
  let { email } = req.body;

  // Check if a user with the given email already exists in the database
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  // If the user does not exist, create a new user
  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    // Send a response with a success message and the created user object
    res.send({
      message: "User registered successfully",
      user: user,
    });
  } else {
    // If the user already exists, send a response with a message indicating this
    res.status(201).send({ message: "User already registered" });
  }
});

/***********************************************************************************************************
 * bookVisit - An asynchronous function to book a visit to a residency.
 * 
 * This function extracts the user's email and visit date from the request body,
 * and the residency ID from the request parameters. It checks if the user has already 
 * booked a visit to the specified residency. If not, it updates the user's booked visits.
 * If an error occurs during the database operation, it catches the error and throws an appropriate error message.
 *
 * @param {Object} req - The request object, containing the user's email and visit date in the body, and the residency ID in the parameters.
 * @param {Object} res - The response object, used to send the response back to the client.
 ***************************************************************************************************************************************************/
export const bookVisit = asyncHandler(async (req, res) => {
  // Extract the user's email and visit date from the request body
  const { email, date } = req.body;
  // Extract the residency ID from the request parameters
  const { id } = req.params;

  try {
    // Check if the user has already booked a visit to the specified residency
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    // If the user has already booked a visit to this residency, send a conflict response
    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res.status(400).json({ message: "This residency is already booked by you" });
    } else {
      // If not, update the user's booked visits with the new visit
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      // Send a success response
      res.send("Your visit is booked successfully");
    }
  } catch (err) {
    // Handle any errors that occur during the database operation
    throw new Error(err.message);
  }
});


/******************************************************************************************************************
 * getAllBookings - An asynchronous function to retrieve all bookings for a specific user.
 * 
 * This function extracts the user's email from the request body and retrieves all bookings 
 * associated with that email from the database. It sends the bookings in the response.
 * If an error occurs during the database operation, it catches the error and throws an appropriate error message.
 *
 * @param {Object} req - The request object, containing the user's email in the body.
 * @param {Object} res - The response object, used to send the response back to the client.
 **********************************************************************************************************************/
export const getAllBookings = asyncHandler(async (req, res) => {
  // Extract the user's email from the request body
  const { email } = req.body;

  try {
    // Retrieve the bookings associated with the provided email from the database
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    // Send the retrieved bookings as the response with a status code of 200
    res.status(200).send(bookings);
  } catch (err) {
    // Handle any errors that occur during the database operation
    throw new Error(err.message);
  }
});

/*******************************************************************************************************************
 * cancelBooking - An asynchronous function to cancel a booking for a specific user.
 * 
 * This function extracts the user's email from the request body and the booking ID from the request parameters.
 * It then checks if the specified booking exists in the user's list of booked visits. If found, it removes the booking 
 * from the list and updates the user's record in the database. If the booking is not found, it sends a 404 response.
 * If an error occurs during the database operation, it catches the error and throws an appropriate error message.
 *
 * @param {Object} req - The request object, containing the user's email in the body and the booking ID in the parameters.
 * @param {Object} res - The response object, used to send the response back to the client.
 ***********************************************************************************************************************/
export const cancelBooking = asyncHandler(async (req, res) => {
  // Extract the user's email from the request body
  const { email } = req.body;
  // Extract the booking ID from the request parameters
  const { id } = req.params;
  
  try {
    // Retrieve the user's booked visits from the database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    // Find the index of the booking to be canceled
    const index = user.bookedVisits.findIndex((visit) => visit.id === id);
    
    // If the booking is not found, send a 404 response
    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      // Remove the booking from the user's list of booked visits
      user.bookedVisits.splice(index, 1);
      // Update the user's record in the database with the updated list of booked visits
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });
      // Send a success response
      res.send("Booking cancelled successfully");
    }
  } catch (err) {
    // Handle any errors that occur during the database operation
    throw new Error(err.message);
  }
});

/**************************************************************************************************************************
 * toFav - An asynchronous function to add or remove a residency from a user's favorite list.
 * 
 * This function extracts the user's email from the request body and the residency ID (rid) from the request parameters.
 * It checks if the residency is already in the user's list of favorite residencies. If it is, the function removes 
 * the residency from the favorites. If not, it adds the residency to the favorites. The updated user record is then 
 * sent in the response.
 * If an error occurs during the database operation, it catches the error and throws an appropriate error message.
 *
 * @param {Object} req - The request object, containing the user's email in the body and the residency ID in the parameters.
 * @param {Object} res - The response object, used to send the response back to the client.
 ***********************************************************************************************************************************/
export const toFav = asyncHandler(async (req, res) => {
  // Extract the user's email from the request body
  const { email } = req.body;
  // Extract the residency ID from the request parameters
  const { rid } = req.params;

  try {
    // Retrieve the user from the database using the provided email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if the residency is already in the user's list of favorite residencies
    if (user.favResidenciesID.includes(rid)) {
      // If the residency is already in favorites, remove it from the list
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid),
          },
        },
      });
      // Send a response indicating the residency was removed from favorites
      res.send({ message: "Removed from favorites", user: updateUser });
    } else {
      // If the residency is not in favorites, add it to the list
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid,
          },
        },
      });
      // Send a response indicating the favorites list was updated
      res.send({ message: "Updated favorites", user: updateUser });
    }
  } catch (err) {
    // Handle any errors that occur during the database operation
    throw new Error(err.message);
  }
});

/***************************************************************************************************************************
 * getAllFavorites - An asynchronous function to retrieve all favorite residencies for a specific user.
 * 
 * This function extracts the user's email from the request body and retrieves the list of favorite residencies 
 * associated with that email from the database. It sends the list in the response.
 * If an error occurs during the database operation, it catches the error and throws an appropriate error message.
 *
 * @param {Object} req - The request object, containing the user's email in the body.
 * @param {Object} res - The response object, used to send the response back to the client.
 ****************************************************************************************************************************/
export const getAllFavorites = asyncHandler(async (req, res) => {
  // Extract the user's email from the request body
  const { email } = req.body;

  try {
    // Retrieve the list of favorite residencies associated with the provided email from the database
    const favResd = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true },
    });

    // Send the retrieved list of favorite residencies as the response with a status code of 200
    res.status(200).send(favResd);
  } catch (err) {
    // Handle any errors that occur during the database operation
    throw new Error(err.message);
  }
});
