import { useState } from "react";
import axios from "axios";

export default function CreateTodo() {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await axios.post("/todos", { text, dueDate });
    setText("");
    setDueDate("");
    window.location.reload();
  };

  return (
    <div className="p-6 w-full font-[lexend]">
      <h1 className="text-2xl font-bold text-onyx mb-4">Add Your Tasks</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Task description..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="p-2 placeholder:text-onyx rounded-md bg-ash text-onyx focus:outline-none focus:ring-2 focus:ring-slate"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 rounded-md bg-ash text-onyx focus:outline-none focus:ring-2 focus:ring-slate"
        />
        <button type="submit" className="btn-nav">
          Create
        </button>
      </form>
    </div>
  );
}
