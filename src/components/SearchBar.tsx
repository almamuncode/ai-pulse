interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <input
        type="text"
        placeholder="Search AI news..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="input input-bordered w-full pr-12"
      />

      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40">
        ⌕
      </div>
    </div>
  );
}

export default SearchBar;