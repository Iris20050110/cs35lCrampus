import mongoose from "mongoose";

//text: the task description
//completed: whether it’s done or not
//dueDate: when users want to complete the task
//user: user that creates this task
const todoSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate:   { type: Date, required: true },
  user:      { 
    type: String,
    ref:  'User',
    required: true
  }
}, { timestamps: true });

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
