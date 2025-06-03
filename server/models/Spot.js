import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String },
  rating: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

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
  reviews: {
    type: [reviewSchema],
    default: [],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reportsCount: {
    type: Number,
    default: 0,
  },
  reportedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Spot = mongoose.model("Spot", spotSchema);
export default Spot;
