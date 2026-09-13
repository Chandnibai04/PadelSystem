import dotenv from "dotenv";
dotenv.config();

import { transporter } from "./src/utils/email.js";

transporter.verify((err, success) => {
  if (err) console.log("SMTP Error:", err);
  else console.log("SMTP Ready:", success);
});
