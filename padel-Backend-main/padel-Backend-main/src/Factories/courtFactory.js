import { faker } from "@faker-js/faker";
import Court from "../models/Court.js";

const KARACHI_CENTER = { lat: 24.8607, lng: 67.0011 };
const AREAS = [
  "DHA Phase 6",
  "Clifton",
  "Gulshan-e-Iqbal",
  "PECHS",
  "Bahadurabad",
  "North Nazimabad",
  "Nazimabad",
  "Gulistan-e-Johar"
];

function randomNear({ lat, lng }, maxKm = 10) {
  // Rough offset: 1 degree ~ 111km
  const dx = (Math.random() - 0.5) * (maxKm / 111) * 2;
  const dy = (Math.random() - 0.5) * (maxKm / 111) * 2;
  return { lat: lat + dy, lng: lng + dx };
}

export const createCourt = async () => {
  const area = faker.helpers.arrayElement(AREAS);
  const point = randomNear(KARACHI_CENTER, 12);
  const categories = ["Premium", "Mid", "Average", "Outdoor", "Indoor", "Synthetic"];

  const court = new Court({
    name: `${faker.company.name()} Padel Court`,
    location: `${area}, Karachi`,
    city: "Karachi",
    area,
    price: faker.number.int({ min: 1000, max: 6000 }),
    category: faker.helpers.arrayElement(categories),
    image: `https://picsum.photos/400/300?random=${faker.number.int(10000)}`,
    description: faker.lorem.sentence(12),
    rating: faker.number.int({ min: 1, max: 5 }),
    video: "/video/padelVideo.mp4",
    available: faker.datatype.boolean(),
    geo: { type: "Point", coordinates: [point.lng, point.lat] }
  });

  return court.save(); // returns a promise
};
