import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/connect.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    console.log("✅ DB connected");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB", err);
  });

