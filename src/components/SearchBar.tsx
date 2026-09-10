interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <input
        type="text"
        placeholder="Search AI news..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="input input-bordered h-13 w-full rounded-xl border-base-300 bg-base-100 pr-12 shadow-sm transition placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
      />

      <div
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-base-content/40"
        aria-hidden="true"
      >
        ⌕
      </div>
    </div>
  );
}

export default SearchBar;