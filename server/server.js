import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import spotsRouter from "./routes/spots.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

app.use("/api/spots", spotsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
