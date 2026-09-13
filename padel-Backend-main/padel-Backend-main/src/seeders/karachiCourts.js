import Court from "../models/Court.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const karachiCourts = [
  {
    name: "DHA Padel Club",
    location: "DHA Phase 6, Karachi",
    city: "Karachi",
    area: "DHA Phase 6",
    price: 1500,
    category: "Premium",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
    description: "Premium padel courts with world-class facilities in the heart of DHA",
    rating: 4.8,
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    available: true,
    isAvailable: true,
    geo: {
      type: "Point",
      coordinates: [67.0833, 24.7933] // DHA Phase 6 coordinates
    }
  },
  {
    name: "Clifton Padel Arena",
    location: "Clifton Block 9, Karachi",
    city: "Karachi",
    area: "Clifton",
    price: 1200,
    category: "Standard",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
    description: "Well-maintained courts near the beach with excellent lighting",
    rating: 4.5,
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    available: true,
    isAvailable: true,
    geo: {
      type: "Point",
      coordinates: [67.0299, 24.8138] // Clifton coordinates
    }
  },
  {
    name: "Gulshan Padel Center",
    location: "Gulshan-e-Iqbal Block 10, Karachi",
    city: "Karachi",
    area: "Gulshan-e-Iqbal",
    price: 800,
    category: "Budget",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
    description: "Affordable courts perfect for beginners and practice sessions",
    rating: 4.2,
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    available: true,
    isAvailable: true,
    geo: {
      type: "Point",
      coordinates: [67.0833, 24.9333] // Gulshan-e-Iqbal coordinates
    }
  },
  {
    name: "North Nazimabad Sports Complex",
    location: "North Nazimabad Block A, Karachi",
    city: "Karachi",
    area: "North Nazimabad",
    price: 900,
    category: "Standard",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    description: "Professional courts with coaching facilities available",
    rating: 4.3,
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    available: true,
    isAvailable: true,
    geo: {
      type: "Point",
      coordinates: [67.0333, 24.9667] // North Nazimabad coordinates
    }
  },
  {
    name: "Bahadurabad Padel Club",
    location: "Bahadurabad, Karachi",
    city: "Karachi",
    area: "Bahadurabad",
    price: 1000,
    category: "Standard",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    description: "Central location with good amenities and parking",
    rating: 4.4,
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    available: true,
    isAvailable: true,
    geo: {
      type: "Point",
      coordinates: [67.0500, 24.9000] // Bahadurabad coordinates
    }
  },
  {
    name: "PECHS Padel Arena",
    location: "PECHS Block 2, Karachi",
    city: "Karachi",
    area: "PECHS",
    price: 1100,
    category: "Standard",
    image: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=800",
    description: "Modern courts with evening floodlights",
    rating: 4.6,
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    available: true,
    isAvailable: true,
    geo: {
      type: "Point",
      coordinates: [67.0667, 24.8500] // PECHS coordinates
    }
  },
  {
    name: "Saddar Padel Club",
    location: "Saddar, Karachi",
    city: "Karachi",
    area: "Saddar",
    price: 950,
    category: "Budget",
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800",
    description: "Historic area with newly renovated padel facilities",
    rating: 4.1,
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    available: true,
    isAvailable: true,
    geo: {
      type: "Point",
      coordinates: [67.0011, 24.8607] // Saddar coordinates
    }
  },
  {
    name: "Defence Racket Hub",
    location: "DHA Phase 5, Karachi",
    city: "Karachi",
    area: "DHA Phase 5",
    price: 1400,
    category: "Premium",
    image: "https://images.unsplash.com/photo-1542156822-69c0632ea9b4?w=800",
    description: "Premium facilities with pro shop and café",
    rating: 4.7,
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    available: true,
    isAvailable: true,
    geo: {
      type: "Point",
      coordinates: [67.0667, 24.7833] // DHA Phase 5 coordinates
    }
  },
  {
    name: "Korangi Padel Courts",
    location: "Korangi Creek, Karachi",
    city: "Karachi",
    area: "Korangi",
    price: 700,
    category: "Budget",
    image: "https://images.unsplash.com/photo-1505459665314-140cbd6d460c?w=800",
    description: "Affordable courts in developing area with good potential",
    rating: 3.9,
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    available: true,
    isAvailable: true,
    geo: {
      type: "Point",
      coordinates: [67.1333, 24.8333] // Korangi coordinates
    }
  },
  {
    name: "Liyari Sports Complex",
    location: "Liyari, Karachi",
    city: "Karachi",
    area: "Liyari",
    price: 600,
    category: "Budget",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800",
    description: "Community courts promoting sports in the area",
    rating: 3.8,
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    available: true,
    isAvailable: true,
    geo: {
      type: "Point",
      coordinates: [67.0167, 24.8833] // Liyari coordinates
    }
  }
];

export const seedKarachiCourts = async () => {
  try {
    console.log("🔄 Starting Karachi courts seeding...");

    // Clear existing courts
    const deleteResult = await Court.deleteMany({});
    console.log(`🗑️ Cleared ${deleteResult.deletedCount} existing courts`);

    // Add Karachi courts
    const courts = await Court.insertMany(karachiCourts);
    console.log(`✅ Successfully seeded ${courts.length} Karachi courts:`);
    courts.forEach(court => {
      console.log(`   - ${court.name} (${court.area}) - Rs. ${court.price}/hr`);
    });

    return courts;
  } catch (error) {
    console.error("❌ Error seeding Karachi courts:", error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    await seedKarachiCourts();
    await mongoose.disconnect();
    console.log("🎉 Karachi courts seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}