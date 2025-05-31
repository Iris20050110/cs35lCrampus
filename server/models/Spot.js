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
  photoFileId: mongoose.Schema.Types.ObjectId,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Spot = mongoose.model("Spot", spotSchema);
export default Spot;
