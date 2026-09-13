import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, addHours } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface Court {
  _id: string;
  name: string;
  type: string;
  price: number; // updated field
  isAvailable: boolean;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  court: string; // this is courtId
  paymentMethod: string;
}

const durationOptions = [
  { value: 1, label: "1 hour" },
  { value: 2, label: "2 hours" },
  { value: 3, label: "3 hours" },
  { value: 4, label: "4 hours" },
];

export default function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedCourt = location.state?.court;

  const [date, setDate] = useState<Date | undefined>();
  const [duration, setDuration] = useState<number>(1);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [emailError, setEmailError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoadingCourts, setIsLoadingCourts] = useState(true);
  const [courtError, setCourtError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    court: "",
    paymentMethod: "",
  });

  // Fetch courts
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setIsLoadingCourts(true);
        const response = await fetch("http://localhost:5000/api/courts");
        if (!response.ok) throw new Error(`Failed to fetch courts: ${response.status}`);
        const data = await response.json();

        // Filter courts if location is selected
        let filteredCourts = data;
        if (passedCourt && passedCourt.location) {
          setSelectedLocation(passedCourt.location);
          // Filter courts by location (case-insensitive)
          filteredCourts = data.filter((court: Court) =>
            court.location?.toLowerCase().includes(passedCourt.location.toLowerCase()) ||
            court.area?.toLowerCase().includes(passedCourt.location.toLowerCase()) ||
            court.city?.toLowerCase().includes(passedCourt.location.toLowerCase())
          );
        }

        setCourts(filteredCourts);

        // Auto-select court if passed from home page
        if (passedCourt && passedCourt._id) {
          setFormData((prev) => ({ ...prev, court: passedCourt._id }));
        }

        setCourtError("");
      } catch (err: any) {
        console.error("Error fetching courts:", err);
        setCourtError("Failed to load courts. Please try again later.");
      } finally {
        setIsLoadingCourts(false);
      }
    };
    fetchCourts();
  }, [passedCourt]);

  // Check if user logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userData && token) {
      try {
        const user: UserData = JSON.parse(userData);
        setIsLoggedIn(true);
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        }));
      } catch (e) {
        console.error(e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  // Generate timeslots and filter by availability
  useEffect(() => {
    if (date) {
      const times: string[] = [];
      for (let hour = 8; hour <= 22; hour++) times.push(`${hour.toString().padStart(2, "0")}:00`);
      setAvailableTimes(times);
      setSelectedTime("");
    }
  }, [date, formData.court]); // Re-run when court changes to check availability

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") setEmailError("");
  };

  const calculateEndTime = () => {
    if (!selectedTime) return "";
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startDate = date ? new Date(date) : new Date();
    startDate.setHours(hours, minutes);
    const endDate = addHours(startDate, duration);
    return format(endDate, "HH:mm");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.court || !date || !selectedTime) {
      alert("Please fill all booking details");
      return;
    }

    if (!isLoggedIn) {
      alert("Please login first to continue to payment.");
      navigate("/login");
      return;
    }

    const selectedCourt = courts.find(c => c._id === formData.court);
    if (!selectedCourt) {
      alert("Please select a valid court.");
      return;
    }

    const totalPrice = (selectedCourt.price || 0) * duration;

    const bookingData = {
      ...formData,
      courtId: formData.court,
      courtName: selectedCourt.name,
      courtPrice: selectedCourt.price,
      totalPrice,
      date: date.toISOString(),
      time: selectedTime,
      duration,
      userId: JSON.parse(localStorage.getItem("user") || "{}")._id
    };

    // Navigate to payment with booking data
    navigate("/payment", { state: { bookingData } });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 py-10">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 bg-[#1e293b] p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl text-center font-semibold text-[#84cc16]">Book Your Court</h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#1e293b] text-white border border-[#84cc16]"
            required
            disabled={isLoggedIn}
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#1e293b] text-white border border-[#84cc16]"
            required
            disabled={isLoggedIn}
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#1e293b] text-white border border-[#84cc16]"
            required
            disabled={isLoggedIn}
          />

          <div>
            {selectedLocation && (
              <p className="text-sm text-[#84cc16] mb-2">📍 Filtered by: {selectedLocation}</p>
            )}
            <select
              name="court"
              value={formData.court}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#1e293b] text-white border border-[#84cc16]"
              required
            >
              <option value="">Select Court</option>
              {isLoadingCourts ? (
                <option value="" disabled>Loading courts...</option>
              ) : courtError ? (
                <option value="" disabled>{courtError}</option>
              ) : courts.length === 0 ? (
                <option value="" disabled>No courts available in this area</option>
              ) : (
                courts.map(court => (
                  <option key={court._id} value={court._id}>
                    {court.name} - Rs. {court.price}/hour {court.location ? `(${court.location})` : ''}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Schedule */}
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-[#84cc16] bg-[#1e293b]">
                <CalendarIcon className="h-5 w-5 text-[#84cc16]" />
                <span>
                  {date && selectedTime 
                    ? `${format(date, "PPP")} at ${selectedTime} for ${duration} hour${duration > 1 ? 's' : ''}` 
                    : "Select Schedule"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="bg-[#0f172a] p-4 rounded-xl border border-[#84cc16] space-y-4">
              <Calendar mode="single" selected={date} onSelect={setDate} className="bg-[#0f172a] text-white" />
              {date && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Select Time Slot</label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 rounded-md text-sm ${selectedTime === time ? "bg-[#84cc16] text-black" : "bg-[#1e293b] text-white"}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Select Duration</label>
                    <div className="grid grid-cols-4 gap-2">
                      {durationOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setDuration(option.value)}
                          className={`py-2 rounded-md text-sm ${duration === option.value ? "bg-[#84cc16] text-black" : "bg-[#1e293b] text-white"}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </PopoverContent>
          </Popover>

          {/* Summary */}
          {date && selectedTime && formData.court && (
            <div className="p-4 bg-[#0f172a] rounded-lg border border-[#84cc16]">
              <h3 className="font-semibold text-[#84cc16] mb-2">Booking Summary</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span>Court:</span><span>{courts.find(c => c._id === formData.court)?.name}</span></div>
                <div className="flex justify-between"><span>Date & Time:</span><span>{format(date, "PPP")} at {selectedTime} - {calculateEndTime()}</span></div>
                <div className="flex justify-between"><span>Duration:</span><span>{duration} hour{duration > 1 ? 's' : ''}</span></div>
                <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                  <span>Total:</span>
                  <span>Rs. {(courts.find(c => c._id === formData.court)?.price || 0) * duration}</span>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="w-full py-2 rounded-md bg-[#84cc16] text-black hover:bg-[#65a30d] transition-all font-semibold">
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
