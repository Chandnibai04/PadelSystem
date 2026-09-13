import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarIcon,
  Star,
  Trophy,
  Zap,
  Clock,
  Award,
  PartyPopper,
  Smartphone,
  ThumbsUp,
  Film,
  ChevronRight,
  ChevronDown,
  MapPin,
  X,
} from "lucide-react";
import { format } from "date-fns";
import AOS from "aos";
import "aos/dist/aos.css";

// React Leaflet imports
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://padel-backend-lfb6z27gr-chandni-bais-projects.vercel.app";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// MapPopup Component
interface MapPopupProps {
  onClose: () => void;
  onSelectLocation: (location: string, latlng: L.LatLng) => void;
  initialLocation?: string;
}

// Component to handle map click events
function MapClickHandler({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Component to update map view when search results change
function MapUpdater({ latlng }: { latlng: L.LatLng | null }) {
  const map = useMap();

  useEffect(() => {
    if (latlng) {
      map.setView(latlng, 15);
    }
  }, [latlng, map]);

  return null;
}

// Debounce hook for search input
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const MapPopup: React.FC<MapPopupProps> = ({ onClose, onSelectLocation, initialLocation }) => {
  const [selectedLatLng, setSelectedLatLng] = useState<L.LatLng | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>(initialLocation || "");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialLocation || "");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [manualLocation, setManualLocation] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Mock locations for fallback (Karachi areas only)
  const mockLocations = [
    "DHA Phase 6, Karachi",
    "Clifton, Karachi",
    "Gulshan-e-Iqbal, Karachi",
    "North Nazimabad, Karachi",
    "Bahadurabad, Karachi",
    "PECHS, Karachi",
    "Saddar, Karachi",
    "Defence, Karachi"
  ];

  // Function to search for locations using Nominatim API with fallback
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();

      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        // Fallback to mock locations if no results
        const filteredMockLocations = mockLocations.filter(loc =>
          loc.toLowerCase().includes(query.toLowerCase())
        ).map((loc, index) => ({
          place_id: index,
          display_name: loc,
          lat: (24.8607 + index * 0.01).toString(), // Karachi area coordinates
          lon: (67.0011 + index * 0.01).toString()
        }));

        setSearchResults(filteredMockLocations);
      }
    } catch (error) {
      console.error("Error searching location:", error);
      // Fallback to mock locations on error
      const filteredMockLocations = mockLocations.filter(loc =>
        loc.toLowerCase().includes(query.toLowerCase())
      ).map((loc, index) => ({
        place_id: index,
        display_name: loc,
        lat: (24.8607 + index * 0.01).toString(), // Karachi area coordinates
        lon: (67.0011 + index * 0.01).toString()
      }));

      setSearchResults(filteredMockLocations);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Function to get location name from coordinates (reverse geocoding) with fallback
  const getLocationFromCoords = useCallback(async (latlng: L.LatLng): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`
      );

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();

      if (data && data.display_name) {
        return data.display_name;
      }
      return `Location (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`;
    } catch (error) {
      console.error("Error getting location:", error);
      // Fallback to coordinates if API fails
      return `Location (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`;
    }
  }, []);

  const handleMapClick = async (latlng: L.LatLng) => {
    setSelectedLatLng(latlng);
    setIsLoading(true);

    try {
      const location = await getLocationFromCoords(latlng);
      setSelectedAddress(location);
      setSearchQuery(location);
    } catch (error) {
      console.error("Error getting location:", error);
      setSelectedAddress(`Location (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResultClick = (result: any) => {
    const latlng = L.latLng(parseFloat(result.lat), parseFloat(result.lon));
    setSelectedLatLng(latlng);
    setSelectedAddress(result.display_name);
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  const handleConfirmSelection = () => {
    if (selectedAddress && selectedLatLng) {
      onSelectLocation(selectedAddress, selectedLatLng);
    }
  };

  const handleManualLocationConfirm = () => {
    if (manualLocation.trim()) {
      // Create a mock location with Karachi coordinates
      const lat = 24.8607 + (Math.random() - 0.5) * 0.1;
      const lng = 67.0011 + (Math.random() - 0.5) * 0.1;
      const latlng = L.latLng(lat, lng);

      setSelectedAddress(manualLocation);
      setSearchQuery(manualLocation);
      setSelectedLatLng(latlng);
    }
  };

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      searchLocation(debouncedSearchQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery, searchLocation]);

  // Set initial location if provided
  useEffect(() => {
    if (initialLocation) {
      searchLocation(initialLocation);
    }
  }, [initialLocation, searchLocation]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Select a Location</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isSearching && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    <div className="font-medium">{result.display_name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual location input as fallback */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Or enter location manually..."
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleManualLocationConfirm}
              disabled={!manualLocation.trim()}
              className="px-4 py-2 bg-gray-500 text-white rounded-r-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set
            </button>
          </div>
        </div>

        {/* Selected location display with confirm button */}
        {(selectedAddress || isLoading) && (
          <div className="p-4 bg-blue-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Selected Location:</p>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-blue-600">Loading location...</span>
                </div>
              ) : (
                <p className="text-blue-600">{selectedAddress}</p>
              )}
            </div>
            <button
              onClick={handleConfirmSelection}
              disabled={isLoading || !selectedAddress}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm This Location
            </button>
          </div>
        )}

        {/* Map container */}
        <div className="h-80 relative">
          <MapContainer
            center={[24.8607, 67.0011]} // Karachi coordinates
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            maxBounds={[
              [24.5, 66.8], // Southwest bound
              [25.0, 67.5]  // Northeast bound
            ]}
            maxBoundsViscosity={1.0}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />
            <MapUpdater latlng={selectedLatLng} />
            {selectedLatLng && (
              <Marker position={selectedLatLng}>
                <Popup>
                  {selectedAddress || "Selected location"}
              </Popup>
              </Marker>
            )}
        </MapContainer>

          {/* Click instructions overlay */}
          {!selectedLatLng && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black bg-opacity-60 text-white p-4 rounded-lg">
                <p>Click anywhere on the map to select a location</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
              Cancel
          </button>
            <button
              onClick={handleConfirmSelection}
              disabled={isLoading || !selectedAddress}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Confirm Selection
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

import court1 from "@/assets/popular1.jpg";
import court2 from "@/assets/popular2.jpg";
import court3 from "@/assets/popular3.jpg";
import court4 from "@/assets/popular4.jpg";
import court5 from "@/assets/popular5.jpg";
import court6 from "@/assets/popular6.jpg";
import padelVideo from "@/assets/padel video.mp4";

const courtImages = [court1, court2, court3, court4, court5, court6];

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [area, setArea] = useState("");
  const [filteredCourts, setFilteredCourts] = useState<any[]>([]);
  const [allCourts, setAllCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openMapPopup, setOpenMapPopup] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Fetch courts from backend
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${VITE_API_BASE_URL}/api/courts`);
        if (!response.ok) throw new Error("Failed to fetch courts");
        const data = await response.json();
        setAllCourts(data);
        setFilteredCourts(data);
      } catch (error) {
        console.error("Error fetching courts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  // Get user's current location (limited to Karachi)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Only accept if within Karachi approximate bounds
          const karachiBounds = {
            north: 25.0,
            south: 24.5,
            east: 67.5,
            west: 66.8
          };

          if (latitude >= karachiBounds.south && latitude <= karachiBounds.north &&
              longitude >= karachiBounds.west && longitude <= karachiBounds.east) {
            setUserLocation({ lat: latitude, lng: longitude });
            setArea("Current Location (Karachi)");
          }
        },
        (error) => {
          console.log("Geolocation error or not in Karachi:", error);
        }
      );
    }
  }, []);

  // Fixed template literals with backticks
  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : `${i}`;
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  const handleNearClick = () => {
    if (!userLocation) {
      alert("Please enable location services to find nearby courts");
      return;
    }

    // Filter courts by distance from user's location (within Karachi)
    const nearbyCourts = allCourts.filter((court) => {
      if (!court.geo || !court.geo.coordinates) return false;

      const [courtLng, courtLat] = court.geo.coordinates;
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        courtLat,
        courtLng
      );

      // Only show courts within 10km
      return distance <= 10;
    });

    setFilteredCourts(nearbyCourts);
    console.log("Filtering by: Near Me", nearbyCourts.length, "courts found");
  };

  const handleLowToHighFilter = () => {
    const sortedCourts = [...allCourts].sort((a, b) => a.price - b.price);
    setFilteredCourts(sortedCourts);
    console.log("Filtering by: Low to High");
  };

  const handlePremiumCourtsFilter = () => {
    // Filter courts with rating >= 4.5 and price >= 1000
    const premiumCourts = allCourts.filter(
      (court) => court.rating >= 4.5 && court.price >= 1000
    );
    setFilteredCourts(premiumCourts);
    console.log("Filtering by: Premium Courts", premiumCourts.length, "courts found");
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Add location filter
      if (area && area !== "Current Location (Karachi)") {
        params.append('location', area);
      }

      // Add availability filter if date and time are selected
      if (date && time) {
        params.append('available', 'true');
      }

      const response = await fetch(`${VITE_API_BASE_URL}/api/courts/filter?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to filter courts");

      const data = await response.json();
      setFilteredCourts(data);
      console.log("Search results:", data.length, "courts found");
    } catch (error) {
      console.error("Error filtering courts:", error);
      // Fallback to client-side filtering if backend fails
      let filtered = [...allCourts];

      if (area && area !== "Current Location (Karachi)") {
        filtered = filtered.filter((court) =>
          court.location?.toLowerCase().includes(area.toLowerCase()) ||
          court.area?.toLowerCase().includes(area.toLowerCase()) ||
          court.city?.toLowerCase().includes(area.toLowerCase())
        );
      }

      if (date && time) {
        filtered = filtered.filter((court) => court.available || court.isAvailable);
      }

      setFilteredCourts(filtered);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLocationSelect = (location: string, _latlng: L.LatLng) => {
    setArea(location);
    setOpenMapPopup(false);
  };

  const renderCourt = (court: any, index: number) => {
    return (
      <div key={court._id || index} className="bg-[#0F172A] border border-[#1E293B] rounded-lg shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-[#adef0e]">
        <div className="relative">
          <img
            src={court.image || courtImages[index % courtImages.length]}
            alt={court.name}
            className="w-full h-52 object-cover rounded-t-lg"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = courtImages[index % courtImages.length];
            }}
          />
          <div className="absolute top-2 right-2 bg-[#FFD700] rounded-full p-2 shadow-lg">
            <Trophy className="h-5 w-5 text-[#0F172A]" />
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">{court.name}</h3>
            <span className="text-sm bg-[#adef0e]/20 text-[#adef0e] px-2 py-0.5 rounded">Rs. {court.price}</span>
          </div>
          <p className="text-sm text-[#94A3B8]">{court.description}</p>
          {court.location && (
            <p className="text-sm text-blue-300">📍 {court.location}</p>
          )}
          <div className="flex items-center text-[#FFD700]">
            {[...Array(Math.floor(court.rating || 0))].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#FFD700] stroke-[#FFD700]" />
            ))}
            {court.rating % 1 !== 0 && (
              <Star className="h-4 w-4 fill-[#FFD700]/50 stroke-[#FFD700]" />
            )}
            <span className="text-sm text-[#94A3B8] ml-2">({court.rating || 0})</span>
          </div>
          <Button
            onClick={() => {
              const token = localStorage.getItem("token");
              if (!token) {
                alert("Please login first to book a court");
                navigate("/login");
              } else {
                navigate("/booking", { state: { courtId: court._id, court } });
              }
            }}
            className="w-full bg-transparent border-1 text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617] transition-all"
          >
            <Trophy className="inline mr-2 h-4 w-4" /> Book Now
          </Button>
        </div>
      </div>
    );
  };

  const courtCards = () => {
    if (loading) {
      return (
        <div className="col-span-full text-center text-white font-medium">
          Loading courts...
        </div>
      );
    } else if (filteredCourts.length === 0) {
      return (
        <div className="col-span-full text-center text-red-400 font-medium">
          No courts found matching your criteria
        </div>
      );
    } else {
      return filteredCourts.map((court, index) => renderCourt(court, index));
    }
  };

  return (
    <div className="bg-[#0F172A] text-[#E2E8F0]">
      {/* HERO */}
      <div className="relative h-[100vh] w-full -mt-20 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={padelVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-[#020617]/20 flex items-center z-10 -mt-30">
          <div className="pl-[10%] space-y-6" data-aos="fade-right" data-aos-delay="200">
            <h1 className="text-5xl font-extrabold text-[#94A3B8] text-left leading-tight">
              Find Your <br /> Perfect Padel Court
            </h1>
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  alert("Please login first to book a court");
                  navigate("/login");
                } else {
                  navigate("/booking");
                }
              }}
              className="w-full sm:w-auto bg-[#adef0e] border-1 text-[#020617] hover:bg-[#cfff2e]  hover:text-[#020617] transition-all font-medium px-6 py-3 rounded-md text-lg"
            >
              Book Court
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="lg:-mt-40 z-30 relative flex justify-center">
        <div className="w-[80%] md:w-[80%] bg-[#0F172A]/50 px-4 md:px-8 py-3 rounded-xl border border-[#334155] -ml-2">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex items-center gap-2 w-full md:w-1/4 bg-[#0F172A] p-3 rounded-xl shadow border border-[#334155] hover:border-[#adef0e] transition-all">
              <button
                onClick={() => setOpenMapPopup(true)}
                className="text-[#64748B] hover:text-[#adef0e] transition-colors"
              >
                <MapPin className="h-5 w-5" />
              </button>
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter area name"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-[#64748B]"
              />
            </div>

            <Popover>
              <PopoverTrigger className="flex items-center gap-2 w-full md:w-1/5 bg-[#0F172A] p-3 rounded-xl shadow border border-[#334155] text-sm text-white hover:border-[#adef0e] transition-all">
                <CalendarIcon className="w-4 h-4 text-[#adef0e]" />
                {date ? format(date, "PPP") : "Select date"}
              </PopoverTrigger>
              <PopoverContent className="bg-[#0F172A] border border-[#334155] shadow-lg p-3 rounded-md z-50">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="bg-[#0F172A] text-white"
                />
              </PopoverContent>
            </Popover>

            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full md:w-[15%] text-sm px-3 py-2 rounded-xl bg-[#0F172A] text-white border border-[#334155] shadow hover:border-[#adef0e] transition-all"
            >
              <option value="" className="bg-[#0F172A]">
                Select time
              </option>
              {times.map((t) => (
                <option key={t} value={t} className="bg-[#0F172A]">
                  {t}
                </option>
              ))}
            </select>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-auto border-1 hover:bg-[#adef0e] hover:text-black transition-all"
                  >
                    Filter Courts <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0F172A] border border-[#334155] text-white">
                  <DropdownMenuItem
                    onClick={handleNearClick}
                    className="hover:bg-[#1E293B] focus:hover:bg-[#adef0e] cursor-pointer"
                  >
                    Near Me
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLowToHighFilter}
                    className="hover:bg-[#1E293B] focus:hover:bg-[#adef0e] cursor-pointer"
                  >
                    Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handlePremiumCourtsFilter}
                    className="hover:bg-[#1E293B] focus:hover:bg-[#adef0e] cursor-pointer"
                  >
                    Premium Courts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={handleSearch}
                className="w-full md:w-auto border-1  hover:bg-[#adef0e] hover:text-black transition-all"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Popup */}
      {openMapPopup && (
        <MapPopup
          onClose={() => setOpenMapPopup(false)}
          onSelectLocation={handleLocationSelect}
          initialLocation={area}
        />
      )}

      {/* ABOUT */}
      <section className="mt-30 w-full flex flex-col md:flex-row h-auto" data-aos="fade-up">
        <div
          className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${court2})` }}
        ></div>
        <div className="w-full md:w-1/2 bg-[#0F172A] flex items-center px-6 py-12 text-left">
          <div className="max-w-xl space-y-6">
            <p className="text-[#adef0e] uppercase tracking-widest font-medium">
              Welcome
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              ABOUT <br /> PADELBOOKING
            </h2>
            <p className="text-[#94A3B8] text-base leading-relaxed">
              Your gateway to discovering and booking padel courts anywhere in Pakistan.
              We're here to make your game-time hassle-free and unforgettable.
            </p>
            <Button
              onClick={() => navigate("/about")}
              className="bg-transparent border-1 text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617] transition-all"
            >
              About Us
            </Button>
          </div>
        </div>
      </section>

      {/* DYNAMIC PLAY */}
      <section className="w-full bg-[#0F172A] py-20 mt-20 relative overflow-hidden" data-aos="fade-up">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row relative">
          <div className="hidden md:block w-[40%]" />
          <div
            className="w-full md:w-[70%] h-80 md:h-[400px] bg-cover bg-center relative z-0"
            style={{ backgroundImage: `url(${court6})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-[#020617]/70 to-transparent" />
          </div>
          <div className="absolute top-1/2 right-[45%] transform -translate-y-1/2 z-10 w-[50%] max-w-xl bg-[#1E293B]/90 backdrop-blur-md px-6 md:px-8 py-6 rounded-md shadow-lg text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase text-white leading-tight">
              Dynamic Play<br />Padel Unveiled
            </h2>
            <p className="mt-4 text-[#94A3B8] text-lg leading-relaxed">
              Step into the vibrant energy of padel with our latest brand film.
              From the fast-paced rallies to the cheering crowds,
              this visual journey captures the spirit of the game like never before.
              Experience the thrill, the finesse, and the passion that drives padel players across the nation.
            </p>
            <Button
              onClick={() => navigate("/about")}
              className="bg-transparent border-1 text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617] transition-all"
            >
              <Film className="mr-2 h-4 w-4" /> Watch Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;