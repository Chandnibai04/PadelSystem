import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

// ------------------ TypeScript Interface ------------------
interface Court {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  video?: string;
  location?: string;
}

// ------------------ Component ------------------
export default function Courts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });

    // Fetch courts from backend - same endpoint as ManageCompanies
    const fetchCourts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/courts`);
        const data = await res.json();
        setCourts(data);
      } catch (err) {
        console.error("Error fetching courts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#0F172A] pt-28 pb-16 px-4 sm:px-12 text-[#adef0e] -mt-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-20">
          Discover Our Padel Courts
        </h1>
        <div className="text-center text-white text-xl">Loading courts...</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0F172A] pt-28 pb-16 px-4 sm:px-12 text-[#adef0e] -mt-20">
      <h1
        className="text-4xl sm:text-5xl font-extrabold text-center mb-20"
        data-aos="zoom-in"
      >
        Discover Our Padel Courts
      </h1>

      {courts.length === 0 ? (
        <div className="text-center text-white text-xl">
          No courts available. Please check back later.
        </div>
      ) : (
        <div className="space-y-24">
          {courts.map((court, index) => (
            <div
              key={court._id}
              className={`flex flex-col lg:flex-row ${
                index % 2 !== 0 ? "lg:flex-row-reverse" : ""
              } items-center gap-10`}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
            >
              {/* Court Image */}
              <div className="lg:w-1/2 w-full">
                <img
                  src={court.image || `https://picsum.photos/400/300?random=${index}`}
                  alt={court.name}
                  className="rounded-3xl w-full h-[320px] object-cover transform hover:scale-105 transition duration-300"
                  onError={(e) => {
                    // fallback if image fails
                    (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/400/300?random=${index}`;
                  }}
                />
              </div>

              {/* Court Details */}
              <div className="lg:w-1/2 w-full space-y-5 text-white">
                <h2 className="text-3xl font-bold">{court.name}</h2>
                <p className="text-base leading-relaxed text-[#94A3B8]">
                  {court.description}
                </p>
                {court.location && (
                  <p className="text-sm text-blue-300">📍 {court.location}</p>
                )}
                <p className="text-xl font-semibold text-[#adef0e]">
                  Rs {court.price}
                </p>

                <div className="flex gap-4 flex-wrap mt-3">
                  {/* Watch Now (Video) - Only show if video exists */}
                  {court.video && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="bg-[#adef0e] text-black font-semibold hover:bg-[#cfff2e] transition-all"
                          onClick={() => setVideoUrl(court.video || "")}
                        >
                          Watch Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl w-full bg-black">
                        {videoUrl && (
                          <video
                            controls
                            autoPlay
                            className="w-full rounded-lg"
                            src={videoUrl}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Book Now */}
                  <Button
                    onClick={() => navigate("/booking")}
                    className="bg-transparent border text-[#adef0e] hover:bg-[#adef0e] hover:text-black transition-all"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}