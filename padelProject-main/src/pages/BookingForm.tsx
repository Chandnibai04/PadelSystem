import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, addHours } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface Court {
  _id: string;
  name: string;
  type: string;
  price: number;
  isAvailable: boolean;
  location?: string;
  area?: string;
  city?: string;
}

interface UserData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  court: string;
  paymentMethod: string;
}

const DURATION_OPTIONS = [
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

  // Fetch courts and filter based on incoming location parameter
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setIsLoadingCourts(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://padel-backend-lfb6z27gr-chandni-bais-projects.vercel.app";
        const response = await fetch(`${API_BASE_URL}/api/courts`);
        if (!response.ok) throw new Error(`Failed to fetch courts: ${response.status}`);
        
        const data: Court[] = await response.json();
        let filteredCourts = data;

        if (passedCourt?.location) {
          const searchLoc = passedCourt.location.toLowerCase();
          setSelectedLocation(passedCourt.location);
          
          filteredCourts = data.filter((court) =>
            [court.location, court.area, court.city].some(
              (field) => field?.toLowerCase().includes(searchLoc)
            )
          );
        }

        setCourts(filteredCourts);

        if (passedCourt?._id) {
          setFormData((prev) => ({ ...prev, court: passedCourt._id }));
        }

        setCourtError("");
      } catch (err: unknown) {
        console.error("Error fetching courts:", err);
        setCourtError("Failed to load courts. Please try again later.");
      } finally {
        setIsLoadingCourts(false);
      }
    };

    fetchCourts();
  }, [passedCourt]);

  // Sync authentication state from localStorage
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
        console.error("Failed to parse stored user data:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  // Generate mock time slots when date changes
  useEffect(() => {
    if (date) {
      const times: string[] = [];
      for (let hour = 8; hour <= 22; hour++) {
        times.push(`${hour.toString().padStart(2, "0")}:00`);
      }
      setAvailableTimes(times);
      setSelectedTime("");
    }
  }, [date, formData.court]);

  const selectedCourt = useMemo(
    () => courts.find((c) => c._id === formData.court),
    [courts, formData.court]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateEndTime = (): string => {
    if (!selectedTime) return "";
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startDate = date ? new Date(date) : new Date();
    startDate.setHours(hours, minutes);
    const endDate = addHours(startDate, duration);
    return format(endDate, "HH:mm");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.court || !date || !selectedTime) {
      alert("Please fill in all required booking details.");
      return;
    }

    if (!isLoggedIn) {
      alert("Please log in first to proceed to payment.");
      navigate("/login");
      return;
    }

    if (!selectedCourt) {
      alert("Please select a valid court.");
      return;
    }

    let storedUserId = "";
    try {
      const parsedUser = JSON.parse(localStorage.getItem("user") || "{}");
      storedUserId = parsedUser._id || "";
    } catch {
      storedUserId = "";
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
      userId: storedUserId,
    };

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
            className="w-full p-2 rounded-md bg-[#1e293b] text-white border border-[#84cc16] disabled:opacity-60"
            required
            disabled={isLoggedIn}
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#1e293b] text-white border border-[#84cc16] disabled:opacity-60"
            required
            disabled={isLoggedIn}
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#1e293b] text-white border border-[#84cc16] disabled:opacity-60"
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
                courts.map((court) => (
                  <option key={court._id} value={court._id}>
                    {court.name} - Rs. {court.price}/hour {court.location ? `(${court.location})` : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Schedule Trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-[#84cc16] bg-[#1e293b] hover:bg-[#283549] transition-colors"
              >
                <CalendarIcon className="h-5 w-5 text-[#84cc16]" />
                <span>
                  {date && selectedTime
                    ? `${format(date, "PPP")} at ${selectedTime} for ${duration} hour${duration > 1 ? "s" : ""}`
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
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 rounded-md text-sm transition-colors ${
                            selectedTime === time ? "bg-[#84cc16] text-black font-semibold" : "bg-[#1e293b] text-white"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Select Duration</label>
                    <div className="grid grid-cols-4 gap-2">
                      {DURATION_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setDuration(option.value)}
                          className={`py-2 rounded-md text-sm transition-colors ${
                            duration === option.value ? "bg-[#84cc16] text-black font-semibold" : "bg-[#1e293b] text-white"
                          }`}
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

          {/* Booking Summary Card */}
          {date && selectedTime && selectedCourt && (
            <div className="p-4 bg-[#0f172a] rounded-lg border border-[#84cc16]">
              <h3 className="font-semibold text-[#84cc16] mb-2">Booking Summary</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Court:</span>
                  <span>{selectedCourt.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{format(date, "PPP")} at {selectedTime} - {calculateEndTime()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{duration} hour{duration > 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-gray-700 pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-[#84cc16]">Rs. {(selectedCourt.price || 0) * duration}</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-[#84cc16] text-black hover:bg-[#65a30d] transition-all font-semibold"
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
}