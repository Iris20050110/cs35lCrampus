import mongoose from "mongoose";

const spotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  description: String,
  tags: [String],
  hours: {
    open: String,
    close: String,
  },
  imageUrl: String, // path to uploaded image
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
});

const Spot = mongoose.model("Spot", spotSchema);
export default Spot;
