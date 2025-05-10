import mongoose from "mongoose";

const SubproblemSchema = new mongoose.Schema({
  name: String,
});

const ProblemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subproblems: [SubproblemSchema],
});

const Problem = mongoose.model("Problem", ProblemSchema);
export default Problem;
