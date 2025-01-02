import mongoose from "mongoose";

const majorsSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Majors = mongoose.model("Majors", majorsSchema);
export default Majors;
