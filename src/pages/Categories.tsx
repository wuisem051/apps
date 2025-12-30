import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Categories() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg border border-slate-300 p-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Categories</h1>
            <p className="text-slate-600 mb-8">Coming soon</p>
            <p className="text-purple-600">Use Meku to generate content for this page</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}