// // // import { Router } from "express";
// // // import { getCourts, addCourt, getNearbyCourts } from "../controllers/courtController.js";
// // // import { protect, adminOnly } from "../middleware/authMiddleware.js";

// // // const router = Router();

// // // router.get("/", getCourts);
// // // router.get("/near", getNearbyCourts);
// // // router.post("/", protect, adminOnly, addCourt);

// // // export default router;
// // // routes/courtRoutes.js
// // import express from "express";
// // import Court from "../models/Court.js";

// // const router = express.Router();

// // // ✅ Website Owner → Get all courts
// // router.get("/", async (req, res) => {
// //   try {
// //     const courts = await Court.find().populate("company");
// //     res.json(courts);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ✅ Company → Get only its own courts
// // router.get("/company/:companyId", async (req, res) => {
// //   try {
// //     const courts = await Court.find({ company: req.params.companyId });
// //     res.json(courts);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ✅ Company → Add new court
// // router.post("/", async (req, res) => {
// //   try {
// //     const { name, location, price, category, image, description, rating, video, company } = req.body;
// //     const court = await Court.create({
// //       name, location, price, category, image, description, rating, video, company
// //     });
// //     res.json(court);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ✅ Company → Update its own court
// // router.put("/:courtId", async (req, res) => {
// //   try {
// //     const court = await Court.findOneAndUpdate(
// //       { _id: req.params.courtId, company: req.body.company }, // company sirf apna edit karega
// //       req.body,
// //       { new: true }
// //     );
// //     if (!court) return res.status(403).json({ message: "Not allowed to edit this court" });
// //     res.json(court);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ✅ Company → Delete its own court
// // router.delete("/:courtId", async (req, res) => {
// //   try {
// //     const court = await Court.findOneAndDelete({
// //       _id: req.params.courtId,
// //       company: req.body.company
// //     });
// //     if (!court) return res.status(403).json({ message: "Not allowed to delete this court" });
// //     res.json({ message: "Court deleted" });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // export default router;
// import express from "express";
// import Court from "../models/Court.js";

// const router = express.Router();

// // ✅ Get courts (admin → sab, company → apne)
// router.get("/", protect, async (req, res) => {
//   try {
//     let filter = {};
//     if (req.user.role !== "admin") {
//       filter.company = req.user._id;
//     }

//     const courts = await Court.find(filter).populate("company", "name email");
//     res.json(courts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Add court (company)
// router.post("/", protect, async (req, res) => {
//   try {
//     const court = await Court.create({
//       ...req.body,
//       company: req.user._id, // force current company
//     });
//     res.status(201).json(court);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Update court
// router.put("/:courtId", protect, async (req, res) => {
//   try {
//     const court = await Court.findById(req.params.courtId);
//     if (!court) return res.status(404).json({ message: "Not found" });

//     if (
//       req.user.role !== "admin" &&
//       court.company.toString() !== req.user._id.toString()
//     ) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const updated = await Court.findByIdAndUpdate(req.params.courtId, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Delete court
// router.delete("/:courtId", protect, async (req, res) => {
//   try {
//     const court = await Court.findById(req.params.courtId);
//     if (!court) return res.status(404).json({ message: "Not found" });

//     if (
//       req.user.role !== "admin" &&
//       court.company.toString() !== req.user._id.toString()
//     ) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     await court.deleteOne();
//     res.json({ message: "Court deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;




import express from "express";
import Court from "../models/Court.js";
import { filterCourts } from "../controllers/courtController.js";

const router = express.Router();

// Get all courts
router.get("/", async (req, res) => {
  try {
    const courts = await Court.find();
    res.json(courts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Filter courts by location and availability
router.get("/filter", filterCourts);

// Add new court
router.post("/", async (req, res) => {
  try {
    const court = await Court.create(req.body);
    res.status(201).json(court);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a court
router.put("/:courtId", async (req, res) => {
  try {
    const updated = await Court.findByIdAndUpdate(req.params.courtId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Court not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a court
router.delete("/:courtId", async (req, res) => {
  try {
    const court = await Court.findByIdAndDelete(req.params.courtId);
    if (!court) return res.status(404).json({ message: "Court not found" });
    res.json({ message: "Court deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
