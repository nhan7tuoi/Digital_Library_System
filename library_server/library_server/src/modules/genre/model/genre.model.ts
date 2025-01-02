import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
  name: { type: String },
});

const Genres = mongoose.model("Genres",genreSchema);
export default Genres