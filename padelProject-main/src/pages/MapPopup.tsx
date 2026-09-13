// MapPopup.tsx
import React, { useState, useEffect } from "react";

/**
 * @typedef {Object} MapPopupProps
 * @property {() => void} onClose
 * @property {(location: string) => void} onSelectLocation
 * @property {string} [initialLocation]
 */

// Mock function to simulate getting location from coordinates
const getLocationFromCoords = (_lat: number, _lng: number) => {
  return new Promise((resolve) => {
    // In a real implementation, you would use a geocoding API here
    setTimeout(() => {
      const locations = [
        "New York, NY",
        "London, UK",
        "Paris, France",
        "Tokyo, Japan",
        "Sydney, Australia",
        "Los Angeles, CA",
        "Berlin, Germany",
      ];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      resolve(randomLocation);
    }, 500);
  });
};

interface MapPopupProps {
  onClose: () => void;
  onSelectLocation: (location: string) => void;
  initialLocation?: string;
}

const MapPopup: React.FC<MapPopupProps> = ({ onClose, onSelectLocation, initialLocation }) => {
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Mock map initialization
  useEffect(() => {
    // In a real implementation, you would initialize your map here
    console.log("Map initialized", initialLocation);
  }, [initialLocation]);

  const handleMapClick = async () => {
    // In a real implementation, you would get actual coordinates from the map
    const mockLat = 40.7128 + (Math.random() - 0.5) * 0.1;
    const mockLng = -74.0060 + (Math.random() - 0.5) * 0.1;
    
    setSelectedCoords({ lat: mockLat, lng: mockLng });
    setIsLoading(true);
    
    try {
      const location = await getLocationFromCoords(mockLat, mockLng);
      setSelectedAddress(location as string);
    } catch (error) {
      console.error("Error getting location:", error);
      setSelectedAddress("Unknown location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedAddress) {
      onSelectLocation(selectedAddress);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Select a Location</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div 
          className="h-96 bg-blue-100 relative cursor-pointer flex items-center justify-center"
          onClick={handleMapClick}
        >
          {/* Mock map visualization */}
          <div className="text-center text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="font-medium">Click on the map to select a location</p>
            <p className="text-sm mt-1">(This is a mock implementation. In a real app, this would be an interactive map)</p>
          </div>
          
          {/* Mock pin for selected location */}
          {selectedCoords && (
            <div
              className="absolute text-red-600 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: "50%",
                top: "50%",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Selected Location:</label>
            <div className="min-h-8 p-2 bg-gray-100 rounded">
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading location...</span>
                </div>
              ) : selectedAddress ? (
                <span className="font-medium text-blue-700">{selectedAddress}</span>
              ) : (
                <span className="text-gray-500">No location selected yet</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedAddress}
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

export default MapPopup;