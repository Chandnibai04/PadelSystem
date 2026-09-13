// controllers/booking.controller.js
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import Court from "../models/Court.js"; // fetch court price

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, courtId, date, time, duration, courtName, courtPrice } = req.body;
    console.log(req.body);
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required.",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email, phone });
    // console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please signup first with this email and phone before booking.",
      });
    }

    // Check if court exists
    let court;
    if (courtId) {
      court = await Court.findById(courtId);
      if (!court) return res.status(404).json({ success: false, message: "Court not found." });
    }

    // Check if slot already booked
    const existingBooking = await Booking.findOne({
      courtName: courtName || (court && court.name),
      date,
      time,
    });
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked. Please choose another.",
      });
    }

    // Calculate price
    const pricePerHour = courtPrice || (court && court.pricePerHour) || 0;
    const totalPrice = pricePerHour * duration;

    // Create new booking
    const booking = new Booking({
      name,
      email,
      phone,
      courtName: courtName || (court && court.name),
      courtPrice: pricePerHour,
      totalPrice,
      date,
      time,
      duration,
      userId: user._id,
    });
    console.log(
      booking
    );

    await booking.save();

    res.status(201).json({ success: true, booking, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// CHECK USER
export const checkUser = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ success: false, message: "Email and phone are required." });
    }

    const user = await User.findOne({ email, phone });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found. Please signup first." });
    }

    res.json({ success: true, message: "User exists." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// GET ALL BOOKINGS
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// GET BOOKINGS BY USER
export const getUserBookings = async (req, res) => {
  try {
    const { email, phone } = req.query;

    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required to fetch bookings.",
      });
    }

    const bookings = await Booking.find({ email, phone }).sort({ date: 1, time: 1 });

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user.",
      });
    }

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
