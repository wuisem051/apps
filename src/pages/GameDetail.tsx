import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DownloadFlow from '../components/DownloadFlow';
import AdBanner from '../components/AdBanner';
import { Star, Download, Users, Calendar, Smartphone, HardDrive, MessageSquare, Send } from 'lucide-react';
import { ALL_GAMES } from '../data/mockData';

export default function GameDetail() {
  const { id } = useParams();
  const [showDownloadFlow, setShowDownloadFlow] = useState(false);
  const [reviews, setReviews] = useState([
    { id: 1, user: 'John Doe', rating: 5, comment: 'Amazing game! The graphics are incredible.', date: '2 days ago' },
    { id: 2, user: 'Sarah Smith', rating: 4, comment: 'Very good, but some levels are quite hard.', date: '1 week ago' }
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // Get current game from ALL_GAMES or fallback
  const game = ALL_GAMES.find(g => g.id === id) || {
    id: id || '1',
    title: 'Shadow Fight 3',
    description: 'Shadow Fight 3 is an epic fighting game that combines RPG elements with classical fighting mechanics.',
    longDescription: 'Shadow Fight 3 continues the story of the Shadow Fight universe with enhanced graphics and gameplay. Battle through multiple chapters, collect weapons and armor, and master different fighting styles.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop'
    ],
    rating: 4.5,
    downloads: '10M+',
    size: '125MB',
    version: '1.25.8',
    category: 'Action',
    developer: 'Nekki',
    requirements: 'Android 5.0+',
    downloadUrl: '#'
  };

  const relatedGames = ALL_GAMES.filter(g => g.category === game.category && g.id !== id).slice(0, 3);

  const handleDownloadClick = () => {
    setShowDownloadFlow(true);
  };

  const handleDownloadComplete = () => {
    setShowDownloadFlow(false);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment) return;
    const review = {
      id: Date.now(),
      user: 'Anonymous',
      rating: newReview.rating,
      comment: newReview.comment,
      date: 'Just now'
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (showDownloadFlow) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DownloadFlow
              gameTitle={game.title}
              downloadUrl={game.downloadUrl || '#'}
              onDownloadComplete={handleDownloadComplete}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                <div className="lg:w-2/3">
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                      {game.category}
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{game.title}</h1>
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">{game.description}</p>

                    <div className="flex flex-wrap items-center gap-6 mb-8">
                      <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-xl">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-bold text-yellow-700 text-lg">{game.rating}</span>
                        <span className="text-yellow-600/70 text-sm">({reviews.length + 12345} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-xl text-slate-700">
                        <Download className="w-5 h-5 text-slate-500" />
                        <span className="font-bold">{game.downloads} Downloads</span>
                      </div>
                    </div>

                    <button
                      onClick={handleDownloadClick}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-10 py-4 rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-purple-200 active:scale-95 flex items-center justify-center space-x-3"
                    >
                      <Download className="w-6 h-6" />
                      <span>Free Download APK</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t border-slate-100 pt-6">
                    <div className="flex flex-col">
                      <span className="text-slate-400 mb-1">Size</span>
                      <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                        <HardDrive className="w-4 h-4" />
                        <span>{game.size}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 mb-1">Version</span>
                      <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                        <Calendar className="w-4 h-4" />
                        <span>v{game.version}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 mb-1">Android</span>
                      <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                        <Smartphone className="w-4 h-4" />
                        <span>{game.requirements}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 mb-1">Developer</span>
                      <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                        <Users className="w-4 h-4" />
                        <span>{game.developer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AdBanner zoneId="game-detail-banner-1" className="my-12" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-8 bg-purple-600 rounded-full"></div>
                  About {game.title}
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                  {game.longDescription || game.description}
                </p>
              </section>

              <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-8 bg-pink-500 rounded-full"></div>
                  Screenshots
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(game as any).screenshots?.map((screenshot: string, index: number) => (
                    <img
                      key={index}
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-zoom-in"
                    />
                  )) || (
                      <div className="col-span-full h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        No screenshots available
                      </div>
                    )}
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <div className="w-1.5 h-8 bg-green-500 rounded-full"></div>
                  Reviews & Ratings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="md:col-span-1 bg-slate-50 rounded-2xl p-6 text-center flex flex-col justify-center border border-slate-100">
                    <div className="text-5xl font-black text-slate-800 mb-2">{game.rating}</div>
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-5 h-5 ${star <= Math.floor(game.rating as number) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                      ))}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">Out of 5 Stars</div>
                  </div>

                  <div className="md:col-span-2">
                    <form onSubmit={handleAddReview} className="space-y-4">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-sm font-semibold text-slate-700">Your Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className={`p-1 transition-colors ${star <= newReview.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                            >
                              <Star className={`w-6 h-6 ${star <= newReview.rating ? 'fill-current' : ''}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          placeholder="Share your experience with this game..."
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 transition-all resize-none"
                        />
                        <button
                          type="submit"
                          className="absolute bottom-4 right-4 bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-600 font-bold">
                            {review.user[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{review.user}</div>
                            <div className="text-xs text-slate-400 font-medium">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-13">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <AdBanner zoneId="game-detail-sidebar-1" width={300} height={250} className="shadow-sm rounded-2xl overflow-hidden" />

              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                  Game Info
                </h3>
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500">Category</span>
                    <span className="text-purple-600 px-3 py-1 bg-purple-50 rounded-lg">{game.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500">Developer</span>
                    <span className="text-slate-800">{game.developer}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500">Price</span>
                    <span className="text-green-600 font-bold uppercase tracking-wider">Free</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500">Type</span>
                    <span className="text-slate-800">APK</span>
                  </div>
                </div>
              </div>

              <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                  Related Games
                </h3>
                <div className="space-y-5">
                  {relatedGames.map((rg) => (
                    <Link
                      key={rg.id}
                      to={`/game/${rg.id}`}
                      className="flex items-center gap-4 group"
                    >
                      <img
                        src={rg.image}
                        alt={rg.title}
                        className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-all"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors line-clamp-1">
                          {rg.title}
                        </div>
                        <div className="text-xs text-slate-400 mb-1">{rg.category}</div>
                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                          <Star className="w-3 h-3 fill-current" />
                          {rg.rating}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/games"
                  className="mt-6 block text-center py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-xl transition-colors uppercase tracking-widest"
                >
                  View All
                </Link>
              </section>

              <AdBanner zoneId="game-detail-sidebar-2" width={300} height={250} className="shadow-sm rounded-2xl overflow-hidden" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}