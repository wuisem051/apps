import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-10">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${selectedCategory === 'all'
            ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105'
            : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
          }`}
      >
        All Items
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${selectedCategory === category
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-100 scale-105'
              : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;