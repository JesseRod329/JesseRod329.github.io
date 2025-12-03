import React from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200',
    red: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200',
    green: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200',
    pink: 'bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300 hover:bg-indigo-200',
    teal: 'bg-teal-100 text-teal-700 border-teal-300 hover:bg-teal-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
  };

  const selectedColorClasses: Record<string, string> = {
    blue: 'bg-blue-500 text-white border-blue-600',
    purple: 'bg-purple-500 text-white border-purple-600',
    red: 'bg-red-500 text-white border-red-600',
    green: 'bg-green-500 text-white border-green-600',
    pink: 'bg-pink-500 text-white border-pink-600',
    orange: 'bg-orange-500 text-white border-orange-600',
    yellow: 'bg-yellow-500 text-white border-yellow-600',
    indigo: 'bg-indigo-500 text-white border-indigo-600',
    teal: 'bg-teal-500 text-white border-teal-600',
    gray: 'bg-gray-500 text-white border-gray-600',
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors border-2 ${
          selectedCategory === null
            ? 'bg-gray-800 text-white border-gray-900'
            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
        }`}
      >
        All Tools
      </button>
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        const baseClasses = colorClasses[category.color] || colorClasses.gray;
        const selectedClasses = selectedColorClasses[category.color] || selectedColorClasses.gray;
        
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors border-2 flex items-center gap-2 ${
              isSelected ? selectedClasses : baseClasses
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;

