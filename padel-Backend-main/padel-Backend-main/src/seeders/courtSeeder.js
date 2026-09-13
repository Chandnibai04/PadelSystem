import mongoose from "mongoose";
import dotenv from "dotenv";
import Court from "../models/Court.js";
import { createCourt } from "../Factories/courtFactory.js";

dotenv.config();

export const seedCourts = async () => {
  try {
    await Court.deleteMany({}); // optional: clear old courts
    const tasks = Array.from({ length: 30 }).map(() => createCourt());
    await Promise.all(tasks); // save all courts
    console.log("✅ Courts seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding courts:", err.message);
  }
};
