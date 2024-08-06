// Import the Express.js framework
import express from "express";

// Import the residency controller functions
import {
  createResidency,
  getAllResidencies,
  getResidency,
} from "../controllers/resdCntrl.js";

// Create an instance of the Express router
const router = express.Router();

/**********************************************************************************************************
 * Route to create a new residency
 * @route POST /create
 * @access Public
 **************************************************************************************************************/
router.post("/create", createResidency);

/*************************************************************************************************************
 * Route to get all residencies
 * @route GET /allresd
 * @access Public
 ***************************************************************************************************************/
router.get("/allresd", getAllResidencies);

/****************************************************************************************************************
 * Route to get a specific residency by ID
 * @route GET /:id
 * @access Public
 *****************************************************************************************************************/
router.get("/:id", getResidency);

// Export the router as residencyRoute for use in other parts of the application
export { router as residencyRoute };

