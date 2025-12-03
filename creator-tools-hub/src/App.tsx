import React, { useState, useMemo } from 'react';
import ToolCard from './components/ToolCard';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import toolsData from './data/tools.json';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  path: string;
  status: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('creator-tools-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const categories = toolsData.categories as Category[];
  const allTools = toolsData.tools as Tool[];

  const filteredTools = useMemo(() => {
    let filtered = allTools;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, allTools]);

  const handleToolClick = (tool: Tool) => {
    // Store recently used
    const recent = JSON.parse(localStorage.getItem('creator-tools-recent') || '[]');
    const updated = [tool.id, ...recent.filter((id: string) => id !== tool.id)].slice(0, 10);
    localStorage.setItem('creator-tools-recent', JSON.stringify(updated));
    
    // Navigate to tool (for now, just log - will be actual navigation when tools are built)
    window.location.href = tool.path;
  };

  // Favorite functionality can be added later when needed
  // const toggleFavorite = (toolId: string) => {
  //   const updated = favorites.includes(toolId)
  //     ? favorites.filter((id) => id !== toolId)
  //     : [...favorites, toolId];
  //   setFavorites(updated);
  //   localStorage.setItem('creator-tools-favorites', JSON.stringify(updated));
  // };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                🛠️ Creator Tools Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                50 powerful tools to supercharge your creative workflow
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {allTools.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Tools Available</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultCount={filteredTools.length}
          />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => {
              const categoryInfo = getCategoryInfo(tool.category);
              return (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  categoryInfo={categoryInfo}
                  onClick={() => handleToolClick(tool)}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tools found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {allTools.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tools</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {favorites.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Favorites</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredTools.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Showing</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

