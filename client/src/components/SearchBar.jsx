export default function SearchBar({ onSearch }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = e.target.elements.q.value;
        onSearch(q);
      }}
      className="flex w-full justify-center"
    >
      <input
        name="q"
        placeholder="Search..."
        className="
          bg-ash
          focus:outline-none focus:ring-2 focus:ring-[#b2d2c3]
          rounded-[9px]
          border-none
          mx-[15px]
          px-[175px]
          pl-[10px]
          mb-[50px]
        "
      />
      <button
        type="submit"
        className="
          bg-[#b2d2c3]
          text-white
          px-[20px] py-2
          rounded-full
          font-medium
          hover:opacity-90
          transition
          text-[20px]
          border-none
          mb-[50px]
          py-[7px]
        "
      >
        ⌕
      </button>
    </form>
  );
}
