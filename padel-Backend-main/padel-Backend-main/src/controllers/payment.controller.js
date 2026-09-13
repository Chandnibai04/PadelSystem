import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key_for_boot");
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("🟢 Received amount:", amount); // log what client sends

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount), // make sure it's a number
      currency: "usd", // PKR not supported
      payment_method_types: ['card'],
      confirm: false, // Don't confirm immediately, let frontend handle confirmation
    });

    console.log("✅ PaymentIntent created:", paymentIntent.id, "Status:", paymentIntent.status);

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("❌ Stripe Error:", err); // full error in server logs
    res.status(500).json({ error: err.message || "Stripe error occurred" });
  }
};

export default stripe;
