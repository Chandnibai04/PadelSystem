import { transporter } from "../utils/email.js";

export const sendResetEmail = async (to, resetUrl) => {
  const mailOptions = {
    from: `"Paddle Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password (valid for 15 minutes):</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    `,
  };

  return transporter.sendMail(mailOptions);
};
