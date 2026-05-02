const categories = ['All', 'Food', 'Stationery', 'PG Accommodation'];

const CategoryFilter = ({ selectedCategory = 'All', onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white/80 p-1.5 shadow-sm">
      {categories.map((category) => {
        const active = selectedCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
              active
                ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                : 'border-transparent bg-transparent text-slate-700 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
