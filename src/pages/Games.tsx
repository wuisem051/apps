import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';
import CategoryFilter from '../components/CategoryFilter';
import AdBanner from '../components/AdBanner';
import { Filter, Grid, List } from 'lucide-react';
import { ALL_GAMES } from '../data/mockData';

export default function Games() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');

  const gamesOnly = ALL_GAMES.filter(item =>
    !['Social', 'Music'].includes(item.category)
  );

  const categories = ['Action', 'Puzzle', 'Casual', 'Strategy', 'Racing', 'Sports'];

  const filteredGames = selectedCategory === 'all'
    ? gamesOnly
    : gamesOnly.filter(game => game.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Android Games</h1>
            <p className="text-slate-600">
              Discover and download the best Android games. From action-packed adventures to brain-teasing puzzles.
            </p>
          </div>

          <AdBanner placementId="games_banner_1" className="mb-8" />

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64">
              <div className="bg-white rounded-lg border border-slate-300 p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="rating">Highest Rated</option>
                      <option value="downloads">Most Downloaded</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-300'
                      }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-300'
                      }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
                }`}>
                {filteredGames.map((game) => (
                  <GameCard key={game.id} {...game} />
                ))}
              </div>

              <div className="text-center mt-8">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Load More Games
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}