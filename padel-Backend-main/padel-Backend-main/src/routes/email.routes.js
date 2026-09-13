import express from "express";
import { transporter } from "../utils/email.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const info = await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
