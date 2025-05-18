import "../index.css";

export default function SearchBar({ onSearch }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = e.target.elements.q.value;
        onSearch(q);
      }}
      className="flex w-full max-w-md"
    >
      <input
        name="q"
        placeholder="Search..."
        className="
          flex-grow
          border border-gray-300 rounded-l-lg
          px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-[#b2d2c3]
        "
      />
      <button
        type="submit"
        className="
          bg-[#b2d2c3]
          text-white
          px-6 py-2
          rounded-r-lg
          font-medium
          hover:opacity-90
          transition
        "
      >
        Search
      </button>
    </form>
  );
}
