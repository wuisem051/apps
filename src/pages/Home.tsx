import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';
import AdBanner from '../components/AdBanner';
import CategoryFilter from '../components/CategoryFilter';
import { TrendingUp, Download, Users, Star } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useSiteSettings } from '../context/SiteContext';

export default function Home() {
  const { games, apps, isLoading: contentLoading } = useContent();
  const { homeHero, isLoading: settingsLoading } = useSiteSettings();
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (contentLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Syncing with Cloud...</p>
      </div>
    );
  }

  const categories = ['Action', 'Puzzle', 'Social', 'Music', 'Casual', 'Strategy'];

  // Normalize apps to have room for 'category' expected by GameCard
  const normalizedApps = apps.map(app => ({
    ...app,
    category: app.appCategory || 'App'
  }));

  // Combine and sort by createdAt descending (newest first)
  const allContent = [...games, ...normalizedApps].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const filteredGames = selectedCategory === 'all'
    ? allContent
    : allContent.filter(item => item.category === selectedCategory);

  const stats = [
    { icon: Download, label: 'Total Downloads', value: '2B+' },
    { icon: Users, label: 'Active Users', value: '50M+' },
    { icon: Star, label: 'Average Rating', value: '4.5' },
    { icon: TrendingUp, label: 'Apps Available', value: '10K+' }
  ];


  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 to-pink-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                {homeHero.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto font-medium">
                {homeHero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold hover:bg-purple-50 transition-all shadow-lg hover:shadow-purple-200">
                  Browse Games
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm">
                  Popular Apps
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-50 rounded-2xl mb-4 group-hover:bg-purple-100 transition-colors">
                      <Icon className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-800 mb-1 tracking-tight">{stat.value}</div>
                    <div className="text-slate-500 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ad Banner */}
        <section className="py-8 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
            <AdBanner placementId="home_banner_1" fallbackWidth={728} fallbackHeight={90} className="shadow-sm rounded-lg overflow-hidden" />
          </div>
        </section>

        {/* Featured Games & Apps */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Featured Games & Apps</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                Discover the most popular and trending Android games and apps, carefully selected for quality and entertainment.
              </p>
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGames.map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </div>

            <div className="text-center mt-16">
              <button className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-slate-200">
                View All Games & Apps
              </button>
            </div>
          </div>
        </section>

        {/* Ad Banner */}
        <section className="py-8 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
            <AdBanner placementId="home_banner_2" fallbackWidth={728} fallbackHeight={90} className="shadow-sm rounded-lg overflow-hidden" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}