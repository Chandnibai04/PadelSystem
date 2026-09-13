import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import emailRoutes from "./routes/email.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import courtRoutes from "./routes/courtRoutes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

// 1. CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      /\.vercel\.app$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicitly handle preflight OPTIONS requests using a RegExp to avoid Express 5 wildcard crashes
app.options(/.*/, cors());

// 2. Body Parser (Must be before request logging middleware to access req.body)
app.use(express.json());

// 3. Clean Request Logging Middleware
app.use((req, res, next) => {
  // Skip preflight OPTIONS requests to keep Vercel logs clean
  if (req.method !== "OPTIONS") {
    const hasBody = req.body && Object.keys(req.body).length > 0;
    console.log(`[${req.method}] ${req.path}`, hasBody ? req.body : "");
  }
  next();
});

// Root Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Padel System Backend API is active!" });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/payments", paymentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

export default app;