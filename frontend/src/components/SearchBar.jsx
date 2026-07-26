function SearchBar({ search, setSearch }) {
  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="🔍 Search PDFs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          bg-white/5
          border
          border-white/10
          rounded-2xl
          px-6
          py-4
          text-white
          placeholder:text-slate-400
          outline-none
          focus:border-cyan-400
          transition
        "
      />
    </div>
  );
}

export default SearchBar;