import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },     // 🔑 token store hoga
  resetPasswordExpire: { type: Date },      // 🔑 expiry time
}, { timestamps: true });

export default mongoose.model("User", userSchema);
