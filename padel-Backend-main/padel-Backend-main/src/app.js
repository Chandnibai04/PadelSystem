import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import emailRoutes from "./routes/email.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import courtRoutes from "./routes/courtRoutes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Configure CORS for local development and Vercel deployments
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    /\.vercel\.app$/ // Allows all Vercel frontend deployments
  ],
  credentials: true
}));

app.use(express.json());

// Root health-check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Padel System Backend API is active!" });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/payments", paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

export default app;