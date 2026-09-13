import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import VisaMastercardLogo from "@/assets/mastercard.png";
import JazzCashLogo from "@/assets/jazzcash.png";
import EasyPaisaLogo from "@/assets/easypaisa.png";

// Base API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://padel-backend-tau.vercel.app";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface BookingData {
  name: string;
  email: string;
  phone: string;
  court: string;
  courtName: string;
  courtPrice: number;
  paymentMethod: string;
  date: string;
  time: string;
  duration: number;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookingData = location.state?.bookingData as BookingData;

  if (!bookingData) {
    navigate("/booking");
    return null;
  }

  const calculateCourtPrice = () => bookingData.courtPrice * bookingData.duration;
  const calculateTax = () => calculateCourtPrice() * 0.2;
  const calculateTotalAmount = () => calculateCourtPrice() + calculateTax();

  // ✅ Stripe Checkout Form Component
  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      try {
        setIsSubmitting(true);
        setCardError("");

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing");

        // Convert PKR → USD cents
        const PKR_TO_USD = 280;
        const usdCents = Math.round((calculateTotalAmount() / PKR_TO_USD) * 100);
        if (usdCents < 50) throw new Error("Minimum payment is $0.50");

        // 1️⃣ Create payment intent from backend (Trailing slash removed)
        const res = await fetch(`${API_BASE_URL}/api/payments/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: usdCents }),
        });

        const data = await res.json();
        const clientSecret = data.clientSecret || data.client_secret;
        if (!clientSecret) throw new Error("No clientSecret from backend");

        // 2️⃣ Confirm card payment
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error("Card element not found");

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

        console.log("Stripe result:", result);

        if (result.error) {
          console.error("Stripe error:", result.error);
          throw new Error(result.error.message);
        }

        // Handle payment status
        const paymentIntent = result.paymentIntent;
        console.log("Payment intent status:", paymentIntent?.status);

        if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
          // Create booking in database after successful/processing payment (Trailing slash removed)
          const bookingResponse = await fetch(`${API_BASE_URL}/api/bookings`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: bookingData.name,
              email: bookingData.email,
              phone: bookingData.phone,
              courtId: bookingData.court,
              courtName: bookingData.courtName,
              courtPrice: bookingData.courtPrice,
              date: bookingData.date,
              time: bookingData.time,
              duration: bookingData.duration,
            }),
          });

          const bookingResult = await bookingResponse.json();
          console.log("Booking result:", bookingResult);

          if (!bookingResult.success) {
            throw new Error(bookingResult.message || "Failed to create booking");
          }

          navigate("/receipt", {
            state: {
              bookingData: {
                ...bookingData,
                paymentMethod: "card",
                bookingId: paymentIntent.id,
                totalAmount: calculateTotalAmount(),
                databaseBookingId: bookingResult.booking._id,
                paymentStatus: paymentIntent.status,
              },
            },
          });
        } else {
          throw new Error(`Payment status: ${paymentIntent?.status}. Please try again.`);
        }
      } catch (err: any) {
        setCardError(err.message || "Payment failed");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement
          className="p-3 border rounded-md bg-white text-black"
          options={{ hidePostalCode: true }}
          onChange={(e) => setCardError(e.error ? e.error.message : "")}
        />
        {cardError && <p className="text-red-500 text-sm">{cardError}</p>}

        <button
          type="submit"
          disabled={!stripe || isSubmitting}
          className="w-full py-3 rounded-md bg-[#84cc16] text-black hover:bg-[#65a30d] transition-all font-semibold"
        >
          {isSubmitting ? "Processing..." : "Pay with Card"}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 py-10">
      <div className="max-w-xl mx-auto space-y-6 bg-[#1e293b] p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl text-center font-semibold text-[#84cc16]">Payment Method</h2>

        {/* Order Summary */}
        <div className="p-4 bg-[#0f172a] rounded-lg border border-[#84cc16]">
          <h3 className="font-semibold text-[#84cc16] mb-3">Order Summary</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Court:</span><span>{bookingData.courtName}</span></div>
            <div className="flex justify-between"><span>Date & Time:</span><span>{new Date(bookingData.date).toLocaleDateString()} at {bookingData.time}</span></div>
            <div className="flex justify-between"><span>Duration:</span><span>{bookingData.duration} hour{bookingData.duration > 1 ? "s" : ""}</span></div>
            <div className="flex justify-between"><span>Court Fee:</span><span>Rs. {calculateCourtPrice()}</span></div>
            <div className="flex justify-between"><span>Tax (20%):</span><span>Rs. {calculateTax()}</span></div>
            <div className="flex justify-between font-semibold border-t pt-2 mt-2"><span>Total Amount:</span><span className="text-lg">Rs. {calculateTotalAmount()}</span></div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white">Select Payment Method</h3>
          {[
            { id: "card", label: "Credit / Debit Card", logo: VisaMastercardLogo },
            { id: "jazzcash", label: "JazzCash", logo: JazzCashLogo },
            { id: "easypaisa", label: "EasyPaisa", logo: EasyPaisaLogo },
            { id: "cash", label: "Pay at Venue", logo: null },
          ].map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-3 border p-3 rounded-md cursor-pointer transition-all ${
                paymentMethod === method.id ? "border-[#84cc16] bg-white text-black" : "border-gray-400 bg-[#1e293b] hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden"
              />
              {method.logo ? <img src={method.logo} alt={method.label} className="w-16" /> : <span className="text-2xl">💵</span>}
              <span className="text-base font-medium">{method.label}</span>
            </label>
          ))}
        </div>

        {/* Stripe Card Form */}
        {paymentMethod === "card" && (
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}

        {/* Non-Card Payment Submit (JazzCash, EasyPaisa, Pay at Venue) */}
        {paymentMethod !== "card" && paymentMethod && (
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/booking")}
              className="w-full py-3 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-all font-semibold"
            >
              Back to Booking
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  setIsSubmitting(true);
                  const token = localStorage.getItem("token");
                  if (!token) {
                    alert("Please login first");
                    navigate("/login");
                    return;
                  }

                  // Create booking in database for non-card payments (Trailing slash removed)
                  const bookingResponse = await fetch(`${API_BASE_URL}/api/bookings`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      name: bookingData.name,
                      email: bookingData.email,
                      phone: bookingData.phone,
                      courtId: bookingData.court,
                      courtName: bookingData.courtName,
                      courtPrice: bookingData.courtPrice,
                      date: bookingData.date,
                      time: bookingData.time,
                      duration: bookingData.duration,
                    }),
                  });

                  const bookingResult = await bookingResponse.json();

                  if (!bookingResult.success) {
                    alert(bookingResult.message || "Failed to create booking");
                    return;
                  }

                  navigate("/receipt", {
                    state: {
                      bookingData: {
                        ...bookingData,
                        paymentMethod,
                        totalAmount: calculateTotalAmount(),
                        databaseBookingId: bookingResult.booking._id,
                      },
                    },
                  });
                } catch (err: any) {
                  alert(err.message || "Payment failed");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
              className="w-full py-3 rounded-md bg-[#84cc16] text-black hover:bg-[#65a30d] transition-all font-semibold"
            >
              {isSubmitting ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}