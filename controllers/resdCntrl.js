// Import the asyncHandler middleware to handle asynchronous operations and errors
import asyncHandler from "express-async-handler";
// Import the Prisma client instance for database operations
import { prisma } from "../config/prismaConfig.js";

/***************************************************************************************************************
 * createResidency - An asynchronous function to create a new residency.
 * 
 * This function extracts residency details from the request body, creates a new residency in the database,
 * and associates it with an existing user based on the provided email.
 * If a residency with the same address already exists, it throws an error.
 *
 * @param {Object} req - The request object, containing residency data in the body.
 * @param {Object} res - The response object, used to send the response back to the client.
 *****************************************************************************************************************/
export const createResidency = asyncHandler(async (req, res) => {
  // Destructure residency details from the request body
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail,
  } = req.body.data;

  try {
    // Create a new residency in the database
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        image,
        facilities,
        // Connect the residency to an existing user by email
        owner: { connect: { email: userEmail } },
      },
    });

    // Send a response with a success message and the created residency object
    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    // Handle unique constraint error for residency address
    if (err.code === "P2002") {
      throw new Error("A residency with this address already exists");
    }
    // Throw a generic error for any other issues
    throw new Error(err.message);
  }
});

/*****************************************************************************************************************
 * getAllResidencies - An asynchronous function to retrieve all residencies.
 * 
 * This function fetches all residencies from the database, ordered by creation date in descending order.
 * If an error occurs during the database operation, it catches the error and sends an appropriate response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object, used to send the response back to the client.
 *******************************************************************************************************************/
export const getAllResidencies = asyncHandler(async (req, res) => {
  try {
    // Fetch all residencies from the database, ordered by creation date in descending order
    const residencies = await prisma.residency.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Send the fetched residencies as the response
    res.send(residencies);
  } catch (err) {
    // Handle any errors that occur during the database operation
    res.status(500).send({ message: "Failed to fetch residencies", error: err.message });
  }
});

/********************************************************************************************************************
 * getResidency - An asynchronous function to retrieve a specific residency by its ID.
 * 
 * This function extracts the residency ID from the request parameters, 
 * fetches the corresponding residency from the database, and sends it in the response.
 * If an error occurs during the database operation, it catches the error and throws an appropriate error message.
 *
 * @param {Object} req - The request object, containing the residency ID in the parameters.
 * @param {Object} res - The response object, used to send the response back to the client.
 ************************************************************************************************************************/
export const getResidency = asyncHandler(async (req, res) => {
  // Extract the residency ID from the request parameters
  const { id } = req.params;

  try {
    // Fetch the residency from the database using the provided ID
    const residency = await prisma.residency.findUnique({
      where: { id },
    });

    // Send the fetched residency as the response
    res.send(residency);
  } catch (err) {
    // Handle any errors that occur during the database operation
    throw new Error(err.message);
  }
});

