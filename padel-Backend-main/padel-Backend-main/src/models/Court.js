import mongoose from "mongoose";

const GeoSchema = new mongoose.Schema({
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], required: true } // [lng, lat]
}, { _id: false });

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true }, // e.g., "DHA Phase 6, Karachi"
  city: { type: String, default: "Karachi" },
  area: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  video: { type: String, required: true },
  available: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true }, // For frontend compatibility
  geo: { type: GeoSchema, index: "2dsphere" }
}, { timestamps: true });

export default mongoose.model("Court", courtSchema);
// models/Court.js
// import mongoose from "mongoose";

// const courtSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     location: { type: String, required: true },
//     price: { type: Number, required: true },
//     category: { type: String, required: true },
//     image: { type: String, required: true },
//     description: { type: String, required: true },
//     rating: { type: Number, required: true },
//     video: { type: String, required: true },
//     available: { type: Boolean, default: true },
//     company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Court", courtSchema);
