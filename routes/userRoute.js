import express from "express";
import {
  bookVisit,
  createUser,
  getAllBookings,
  cancelBooking,
  toFav,
  getAllFavorites
} from "../controllers/userCntrl.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/bookVisit/:id", bookVisit);
router.post("/allBookings", getAllBookings);
router.post("/removeBooking/:id", cancelBooking);
router.post("/toFav/:rid", toFav);
router.post("/allFav", getAllFavorites);

export { router as userRoute };
