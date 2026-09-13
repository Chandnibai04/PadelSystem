import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, addHours } from "date-fns";

interface BookingData {
  name: string;
  email: string;
  phone: string;
  courtName: string;
  paymentMethod: string;
  date: string;
  time: string;
  duration: number;
  courtPrice: number;
  bookingId?: string;
  totalAmount: number;
}

export default function ReceiptPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef<HTMLDivElement>(null);

  const bookingData = location.state?.bookingData as BookingData;

  if (!bookingData) {
    navigate("/booking");
    return null;
  }

  const calculateCourtPrice = () => bookingData.courtPrice * bookingData.duration;
  const calculateTax = () => calculateCourtPrice() * 0.2;
  const calculateEndTime = () => {
    const [hours, minutes] = bookingData.time.split(":").map(Number);
    const startDate = new Date(bookingData.date);
    startDate.setHours(hours, minutes);
    const endDate = addHours(startDate, bookingData.duration);
    return format(endDate, "HH:mm");
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = `<div style="max-width:800px; margin:0 auto; padding:20px;">${printContents}</div>`;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const handleNewBooking = () => {
    navigate("/booking");
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-6 py-10">
      <div ref={receiptRef} className="max-w-2xl mx-auto bg-white text-black p-8 rounded-xl shadow-lg space-y-6 print:p-2 print:shadow-none print:max-w-none print:rounded-none">
        {/* Receipt Header */}
        <div className="text-center border-b pb-4 print:border-b-2 print:border-gray-300">
          <h1 className="text-3xl font-bold text-[#0F172A] print:text-2xl">Booking Confirmed!</h1>
          <div className="flex justify-center mt-4">
            <div className="w-16 h-16 bg-[#f0fdf4] rounded-full flex items-center justify-center print:w-12 print:h-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#16a34a] print:h-8 print:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 print:text-xs">Booking ID: {bookingData.bookingId || `BK${Math.floor(Math.random() * 1000000)}`}</p>
          <p className="text-sm text-gray-600 print:text-xs">Date: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Customer and Booking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:text-sm">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-[#0F172A] border-b pb-1 print:text-base print:border-b print:border-gray-300">
              Customer Info
            </h3>
            <div className="flex justify-between">
              <span className="text-gray-600 print:text-sm">Name:</span>
              <span className="font-medium print:text-sm">{bookingData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 print:text-sm">Email:</span>
              <span className="font-medium print:text-sm">{bookingData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 print:text-sm">Phone:</span>
              <span className="font-medium print:text-sm">{bookingData.phone}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-[#0F172A] border-b pb-1 print:text-base print:border-b print:border-gray-300">
              Booking Details
            </h3>
            <div className="flex justify-between">
              <span className="text-gray-600 print:text-sm">Court:</span>
              <span className="font-medium print:text-sm">{bookingData.courtName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 print:text-sm">Date:</span>
              <span className="font-medium print:text-sm">{new Date(bookingData.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 print:text-sm">Time:</span>
              <span className="font-medium print:text-sm">
                {bookingData.time} to {calculateEndTime()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 print:text-sm">Duration:</span>
              <span className="font-medium print:text-sm">{bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-2 print:text-sm">
          <h3 className="font-semibold text-lg text-[#0F172A] border-b pb-1 print:text-base print:border-b print:border-gray-300">
            Payment Summary
          </h3>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium capitalize">{bookingData.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Court Fee:</span>
            <span className="font-medium">Rs. {calculateCourtPrice()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (20%):</span>
            <span className="font-medium">Rs. {calculateTax()}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2 print:border-t print:border-gray-300">
            <span className="text-gray-600 font-semibold">Total Amount:</span>
            <span className="font-bold text-lg print:text-base">Rs. {bookingData.totalAmount}</span>
          </div>
        </div>

        {/* Success Message */}
        <div className="p-4 bg-[#f0fdf4] rounded-lg print:p-3 print:rounded print:bg-[#f0fdf4]">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#16a34a] print:h-5 print:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h4 className="font-semibold text-[#166534] print:text-sm">Payment Successful</h4>
              <p className="text-sm text-[#166534] print:text-xs">Your payment has been processed successfully</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 print:hidden">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-md bg-[#84cc16] text-black hover:bg-[#65a30d] transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </button>
          <button
            onClick={handleNewBooking}
            className="px-6 py-2 rounded-md bg-transparent border border-[#84cc16] text-[#84cc16] hover:bg-[#84cc16] hover:text-black transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Book Again
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 rounded-md bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}