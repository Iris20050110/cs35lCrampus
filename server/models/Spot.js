import mongoose from "mongoose";

const SpotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  hours: { open: String, close: String },
  tags: [String], // e.g. ['Quiet','On-Campus']
  features: [String], // e.g. ['Coffee','Available']
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
});

export default mongoose.model("Spot", SpotSchema);
