import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';
import AdBanner from '../components/AdBanner';
import { ALL_GAMES } from '../data/mockData';

export default function Apps() {
  const appsOnly = ALL_GAMES.filter(item =>
    ['Social', 'Music'].includes(item.category)
  );

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

          <AdBanner zoneId="apps-banner-1" className="mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appsOnly.map((app) => (
              <GameCard key={app.id} {...app} />
            ))}
          </div>

          {appsOnly.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">No apps available yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}