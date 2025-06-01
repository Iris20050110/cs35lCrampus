import { useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export default function CreateTodo({ dropdown }) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post("/api/todos", { text, dueDate });
      setText("");
      setDueDate(new Date().toISOString().slice(0, 10));
      dropdown();
      window.location.reload();
    } catch (err) {
      console.error("Create todo error:", err.response || err);
      setError(err.response?.data?.error || "Failed to create todo");
    }
  };

  return (
    <div className="p-6 w-full font-[lexend]">
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <h1 className="text-2xl font-bold text-onyx mb-4 transition-transform duration-300 hover:scale-103 hover:shadow-2xl">
        Add Your Tasks
      </h1>

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
