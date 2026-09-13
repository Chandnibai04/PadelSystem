import Court from "../models/Court.js";

// ✅ Filter courts by location and availability
export const filterCourts = async (req, res) => {
  try {
    const { location, area, city, available, minPrice, maxPrice, minRating } = req.query;

    let query = {};

    // Filter by location (case-insensitive)
    if (location) {
      query.$or = [
        { location: { $regex: location, $options: 'i' } },
        { area: { $regex: location, $options: 'i' } },
        { city: { $regex: location, $options: 'i' } }
      ];
    }

    // Filter by specific area
    if (area) {
      query.area = { $regex: area, $options: 'i' };
    }

    // Filter by city
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Filter by availability
    if (available === 'true') {
      query.available = true;
      query.isAvailable = true;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    const courts = await Court.find(query);
    res.json(courts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ✅ Add court (company ka apna hoga)
export const addCourt = async (req, res) => {
  try {
    const court = await Court.create({
      ...req.body,
      company: req.user?._id, // jisne add kiya wohi owner
    });
    res.status(201).json(court);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// ✅ Update court (company sirf apna edit kar sake)
export const updateCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) return res.status(404).json({ message: "Court not found" });

    if (req.user && req.user.role !== "admin" && court.company?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Court.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ✅ Delete court (sirf apna)
export const deleteCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) return res.status(404).json({ message: "Court not found" });

    if (req.user && req.user.role !== "admin" && court.company?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await court.deleteOne();
    res.json({ message: "Court deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
