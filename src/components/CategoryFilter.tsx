interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const categories = [
  "All",
  "Models",
  "Features",
  "Developer",
  "Research",
  "Creative",
];

function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`btn btn-sm rounded-full px-4 transition-all duration-200 ${
              isSelected
                ? "btn-primary shadow-md shadow-primary/20"
                : "btn-ghost border border-base-300 bg-base-100 hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
