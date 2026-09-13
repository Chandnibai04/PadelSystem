import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Save,
  Edit,
  ArrowLeft,
  CalendarIcon,
  MapPin,
  CreditCard,
  ClockIcon
} from "lucide-react";

// User interface
interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    profilePhoto: ""
  });
  const [tempName, setTempName] = useState("");
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  // Load user data from localStorage on component mount
  useEffect(() => {
    // Try multiple possible keys where user data might be stored
    const savedUserData = localStorage.getItem("user") ||
      localStorage.getItem("userData") ||
      localStorage.getItem("currentUser");

    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        setUserData(parsedData);
        setTempName(parsedData.name);

        // Also update any other potential user storage locations
        localStorage.setItem("user", JSON.stringify(parsedData));
        localStorage.setItem("userData", JSON.stringify(parsedData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Load recent bookings (mock data for demonstration)
    const bookings = [
      {
        id: 1,
        court: "Padel Pro Court",
        date: "2023-10-15",
        time: "16:00 - 17:30",
        price: "Rs. 1200"
      },
      {
        id: 2,
        court: "Elite Smash Zone",
        date: "2023-10-10",
        time: "18:00 - 19:30",
        price: "Rs. 1000"
      }
    ];
    setRecentBookings(bookings);
  }, []);

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  // Save user data to localStorage
  const handleSave = async () => {
    const updatedUserData = {
      ...userData,
      name: tempName
    };

    try {
      // send update request to backend
      await fetch(`http://localhost:5000/api/users/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserData),
      });


      // update local state + storage
      setUserData(updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      localStorage.setItem("currentUser", JSON.stringify(updatedUserData));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };


  // Cancel editing
  const handleCancel = () => {
    setTempName(userData.name);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#E2E8F0] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-[#94A3B8] hover:text-[#adef0e]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-[#adef0e]">My Profile</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Profile Card */}
        <div className="bg-[#1E293B] rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#334155] flex items-center justify-center overflow-hidden">
                {userData.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-[#64748B]" />
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Name</label>
                  {isEditing ? (
                    <Input
                      value={tempName}
                      onChange={handleNameChange}
                      className="bg-[#0F172A] border-[#334155] text-white"
                    />
                  ) : (
                    <p className="text-white">{userData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Email</label>
                  <p className="text-white">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">Phone</label>
                  <p className="text-white">{userData.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-1">User ID</label>
                  <p className="text-white">{userData.id}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing ? (
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    className="bg-[#adef0e] text-[#0F172A] hover:bg-[#cfff2e]"
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-[#334155] text-[#94A3B8] hover:bg-[#334155]"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-[#334155] text-[#94A3B8] hover:bg-[#334155]"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-[#1E293B] rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#adef0e] mb-6">Recent Bookings</h2>

          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="bg-[#0F172A] rounded-lg p-4 border border-[#334155]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{booking.court}</h3>
                      <div className="flex items-center mt-2 text-[#94A3B8]">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center mt-1 text-[#94A3B8]">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>{booking.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[#adef0e] font-semibold">{booking.price}</span>
                      <Button
                        onClick={() => navigate("/booking")}
                        variant="outline"
                        className="border-[#334155] text-[#94A3B8] hover:bg-[#334155]"
                      >
                        Book Again
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#94A3B8] mb-4">You haven't made any bookings yet.</p>
              <Button
                onClick={() => navigate("/courts")}
                className="bg-[#adef0e] text-[#0F172A] hover:bg-[#cfff2e]"
              >
                Book a Court
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate("/booking")}
            className="bg-[#1E293B] text-white hover:bg-[#334155] h-16 flex flex-col items-center justify-center"
          >
            <CalendarIcon className="h-6 w-6 mb-1 text-[#adef0e]" />
            <span>Book Court</span>
          </Button>
          <Button
            onClick={() => navigate("/courts")}
            className="bg-[#1E293B] text-white hover:bg-[#334155] h-16 flex flex-col items-center justify-center"
          >
            <MapPin className="h-6 w-6 mb-1 text-[#adef0e]" />
            <span>Find Courts</span>
          </Button>
          <Button
            onClick={() => navigate("/payment")}
            className="bg-[#1E293B] text-white hover:bg-[#334155] h-16 flex flex-col items-center justify-center"
          >
            <CreditCard className="h-6 w-6 mb-1 text-[#adef0e]" />
            <span>Payment Methods</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;