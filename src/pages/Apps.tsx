import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';
import AdBanner from '../components/AdBanner';
import { Search } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Apps() {
  const { apps } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['Social', 'Music', 'Tools', 'Productivity', 'Entertainment'];

  // Normalize apps for display
  const normalizedApps = apps.map(app => ({
    ...app,
    category: app.appCategory || 'App'
  }));

  const filteredApps = normalizedApps
    .filter(app => {
      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
      const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => 0); // Already prepended, so default order is newest first

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Android Apps</h1>
            <p className="text-slate-600">
              Discover and download the best Android applications. From social media to utility tools.
            </p>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === 'all' ? 'bg-pink-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-pink-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <AdBanner placementId="apps_banner_1" className="mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApps.map((app) => (
              <GameCard key={app.id} {...app} />
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">No apps found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}