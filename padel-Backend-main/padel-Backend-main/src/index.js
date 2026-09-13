import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/connect.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to DB for serverless requests
connectDB().catch((err) => {
  console.error("❌ Failed to connect DB", err);
});

// Run app.listen ONLY in local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export the Express app handler for Vercel
export default app;