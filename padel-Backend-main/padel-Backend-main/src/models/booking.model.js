// models/booking.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    courtName: { type: String, required: true },
    courtPrice: { type: Number, required: true },       // price per hour
    totalPrice: { type: Number, required: true },       // price * duration
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
