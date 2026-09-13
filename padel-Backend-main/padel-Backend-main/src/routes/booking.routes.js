import express from "express";
import { 
  createBooking, 
  checkUser, 
  getBookings, 
  getUserBookings 
} from "../controllers/booking.controller.js";

const router = express.Router();

// CREATE a new booking
router.post("/", async (req, res) => {
  await createBooking(req, res);
});

// CHECK if user exists 
router.post("/check-user", checkUser);

// GET all bookings (for admin)
router.get("/all", getBookings);

// GET bookings by user (requires email + phone in query)
router.get("/user", getUserBookings);

export default router;
