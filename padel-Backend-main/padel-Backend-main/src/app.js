import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import emailRoutes from "./routes/email.routes.js";  // ✅ ./routes/ correct path
import bookingRoutes from "./routes/booking.routes.js"; // ✅ import booking routes
import courtRoutes from "./routes/courtRoutes.js"; // ✅ import court routes
import paymentRoutes from "./routes/payment.routes.js";



const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());

app.use("/api/users", userRoutes);

// ✅ Mount karo with prefix
app.use("/api/bookings", bookingRoutes);  // ✅ mount booking routes

app.use("/api/email", emailRoutes);

app.use("/api/courts", courtRoutes);

app.use("/api/payments", paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

export default app;
