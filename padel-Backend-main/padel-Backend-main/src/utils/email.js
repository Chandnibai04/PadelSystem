import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config(); // load env first

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASS,
  },
});

transporter.verify()
  .then(() => console.log("SMTP Ready"))
  .catch(err => console.error("SMTP Error:", err));
