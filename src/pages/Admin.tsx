import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';
import { Lock, User, Eye, EyeOff, PlusCircle, Trash2, Edit, Check } from 'lucide-react';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

type Game = {
  id: string;
  title: string;
  description: string;
  image?: string;
  rating?: number;
  downloads?: string;
  size?: string;
  category?: string;
  version?: string;
  developer?: string;
  requirements?: string;
  releaseDate?: string;
  downloadUrl?: string;
};

type AppItem = Omit<Game, 'category'> & { appCategory?: string };

type AdSlot = {
  id: string;
  zoneId: string;
  width: number;
  height: number;
  active: boolean;
};

const LS_KEYS = {
  GAMES: 'admin_games_v1',
  APPS: 'admin_apps_v1',
  ADS: 'admin_ads_v1'
};

function generateId(prefix = '') {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ ...ADMIN_CREDENTIALS });

  // Content state
  const [games, setGames] = useState<Game[]>([]);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [ads, setAds] = useState<AdSlot[]>([]);

  // UI state
  const [showGameForm, setShowGameForm] = useState(false);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [gameForm, setGameForm] = useState<Partial<Game>>({});

  const [showAppForm, setShowAppForm] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [appForm, setAppForm] = useState<Partial<AppItem>>({});

  const [showAdForm, setShowAdForm] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [adForm, setAdForm] = useState<Partial<AdSlot>>({ zoneId: '', width: 728, height: 90, active: true });

  useEffect(() => {
    // Load persisted data
    try {
      const g = localStorage.getItem(LS_KEYS.GAMES);
      const a = localStorage.getItem(LS_KEYS.APPS);
      const ad = localStorage.getItem(LS_KEYS.ADS);
      if (g) setGames(JSON.parse(g));
      if (a) setApps(JSON.parse(a));
      if (ad) setAds(JSON.parse(ad));
    } catch (err) {
      console.error('Failed to load admin data from localStorage', err);
    }
  }, []);

  useEffect(() => {
    // Persist whenever arrays change
    try {
      localStorage.setItem(LS_KEYS.GAMES, JSON.stringify(games));
      localStorage.setItem(LS_KEYS.APPS, JSON.stringify(apps));
      localStorage.setItem(LS_KEYS.ADS, JSON.stringify(ads));
    } catch (err) {
      console.error('Failed to save admin data to localStorage', err);
    }
  }, [games, apps, ads]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === ADMIN_CREDENTIALS.username && credentials.password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
    } else {
      alert(`Invalid credentials. Demo credentials are shown below.\nUsername: ${ADMIN_CREDENTIALS.username}\nPassword: ${ADMIN_CREDENTIALS.password}`);
    }
  };

  // Games handlers
  const openNewGameForm = () => {
    setEditingGameId(null);
    setGameForm({
      title: '',
      description: '',
      image: '',
      rating: 4.0,
      downloads: '',
      size: '',
      category: '',
      version: '',
      developer: '',
      requirements: '',
      releaseDate: '',
      downloadUrl: ''
    });
    setShowGameForm(true);
  };

  const openEditGameForm = (game: Game) => {
    setEditingGameId(game.id);
    setGameForm({ ...game });
    setShowGameForm(true);
  };

  const saveGame = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!gameForm.title || !gameForm.downloadUrl) {
      alert('Please provide at least title and download URL for the game.');
      return;
    }
    if (editingGameId) {
      setGames((prev) => prev.map((g) => (g.id === editingGameId ? { ...(g as Game), ...(gameForm as Game) } : g)));
    } else {
      const newGame: Game = { id: generateId('game-'), ...(gameForm as Game) };
      setGames((prev) => [newGame, ...prev]);
    }
    setShowGameForm(false);
    setEditingGameId(null);
    setGameForm({});
  };

  const deleteGame = (id: string) => {
    if (!confirm('Delete this game? This action cannot be undone.')) return;
    setGames((prev) => prev.filter((g) => g.id !== id));
  };

  // Apps handlers
  const openNewAppForm = () => {
    setEditingAppId(null);
    setAppForm({
      title: '',
      description: '',
      image: '',
      rating: 4.0,
      downloads: '',
      size: '',
      appCategory: '',
      version: '',
      developer: '',
      requirements: '',
      releaseDate: '',
      downloadUrl: ''
    });
    setShowAppForm(true);
  };

  const openEditAppForm = (app: AppItem) => {
    setEditingAppId(app.id);
    setAppForm({ ...app });
    setShowAppForm(true);
  };

  const saveApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!appForm.title || !appForm.downloadUrl) {
      alert('Please provide at least title and download URL for the app.');
      return;
    }
    if (editingAppId) {
      setApps((prev) => prev.map((a) => (a.id === editingAppId ? { ...(a as AppItem), ...(appForm as AppItem) } : a)));
    } else {
      const newApp: AppItem = { id: generateId('app-'), ...(appForm as AppItem) };
      setApps((prev) => [newApp, ...prev]);
    }
    setShowAppForm(false);
    setEditingAppId(null);
    setAppForm({});
  };

  const deleteApp = (id: string) => {
    if (!confirm('Delete this app? This action cannot be undone.')) return;
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  // Ads handlers
  const openNewAdForm = () => {
    setEditingAdId(null);
    setAdForm({ zoneId: '', width: 728, height: 90, active: true });
    setShowAdForm(true);
  };

  const openEditAdForm = (ad: AdSlot) => {
    setEditingAdId(ad.id);
    setAdForm({ ...ad });
    setShowAdForm(true);
  };

  const saveAd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!adForm.zoneId) {
      alert('Please provide a zoneId for the ad slot.');
      return;
    }
    if (editingAdId) {
      setAds((prev) => prev.map((a) => (a.id === editingAdId ? { ...(a as AdSlot), ...(adForm as AdSlot) } : a)));
    } else {
      const newAd: AdSlot = { id: generateId('ad-'), zoneId: String(adForm.zoneId), width: Number(adForm.width || 728), height: Number(adForm.height || 90), active: Boolean(adForm.active) };
      setAds((prev) => [newAd, ...prev]);
    }
    setShowAdForm(false);
    setEditingAdId(null);
    setAdForm({ zoneId: '', width: 728, height: 90, active: true });
  };

  const deleteAd = (id: string) => {
    if (!confirm('Delete this ad slot?')) return;
    setAds((prev) => prev.filter((a) => a.id !== id));
  };

  // Quick stats (derived)
  const totalGames = games.length || 156; // fallback to demo metric
  const totalApps = apps.length || 89;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        
        <main className="py-16">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white rounded-lg border border-slate-300 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-purple-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Admin Login</h1>
                <p className="text-slate-600">Access the admin panel to manage content</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Login to Admin Panel
                </button>
              </form>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Demo Credentials:</strong><br />
                  Username: <span className="font-mono">{ADMIN_CREDENTIALS.username}</span><br />
                  Password: <span className="font-mono">{ADMIN_CREDENTIALS.password}</span>
                </p>
              </div>
            </div>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Admin Dashboard</h1>
            <p className="text-slate-600">Manage games, apps, and monetization settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-slate-300 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Games</h3>
              <p className="text-3xl font-bold text-purple-600">{totalGames}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-300 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Apps</h3>
              <p className="text-3xl font-bold text-pink-500">{totalApps}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-300 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Downloads Today</h3>
              <p className="text-3xl font-bold text-green-600">2,341</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-300 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Ad Revenue</h3>
              <p className="text-3xl font-bold text-blue-600">$1,234</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-lg border border-slate-300 p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={openNewGameForm}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Add New Game
              </button>
              <button
                onClick={openNewAppForm}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Add New App
              </button>
              <button
                onClick={openNewAdForm}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Manage Ads
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Games list */}
            <div className="col-span-1 lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Games ({games.length})</h3>
                  <button
                    onClick={openNewGameForm}
                    className="text-sm text-purple-600 hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" /> New
                  </button>
                </div>

                {games.length === 0 ? (
                  <p className="text-sm text-slate-500">No games added yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {games.map((g) => (
                      <li key={g.id} className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img src={g.image || 'https://via.placeholder.com/60x40?text=GAME'} alt={g.title} className="w-16 h-10 object-cover rounded-md" />
                          <div>
                            <div className="font-medium text-slate-800">{g.title}</div>
                            <div className="text-xs text-slate-500">{g.downloads || '—'} • {g.size || '—'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button title="Edit" onClick={() => openEditGameForm(g)} className="p-2 rounded-md hover:bg-slate-100">
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>
                          <button title="Delete" onClick={() => deleteGame(g.id)} className="p-2 rounded-md hover:bg-slate-100">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Game form modal/section */}
              {showGameForm && (
                <div className="mt-4 bg-white rounded-lg border border-slate-300 p-6">
                  <h4 className="text-lg font-semibold mb-3">{editingGameId ? 'Edit Game' : 'Add New Game'}</h4>
                  <form onSubmit={saveGame} className="space-y-3">
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Title</label>
                      <input value={gameForm.title || ''} onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })} className="w-full border border-slate-300 rounded px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Description</label>
                      <textarea value={gameForm.description || ''} onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })} className="w-full border border-slate-300 rounded px-3 py-2" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">Image URL</label>
                        <input value={gameForm.image || ''} onChange={(e) => setGameForm({ ...gameForm, image: e.target.value })} className="w-full border border-slate-300 rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">Category</label>
                        <input value={gameForm.category || ''} onChange={(e) => setGameForm({ ...gameForm, category: e.target.value })} className="w-full border border-slate-300 rounded px-3 py-2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input value={gameForm.downloads || ''} onChange={(e) => setGameForm({ ...gameForm, downloads: e.target.value })} placeholder="Downloads" className="border border-slate-300 rounded px-3 py-2" />
                      <input value={gameForm.size || ''} onChange={(e) => setGameForm({ ...gameForm, size: e.target.value })} placeholder="Size" className="border border-slate-300 rounded px-3 py-2" />
                      <input value={gameForm.rating?.toString() || ''} onChange={(e) => setGameForm({ ...gameForm, rating: Number(e.target.value) })} placeholder="Rating" className="border border-slate-300 rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Download URL</label>
                      <input value={gameForm.downloadUrl || ''} onChange={(e) => setGameForm({ ...gameForm, downloadUrl: e.target.value })} className="w-full border border-slate-300 rounded px-3 py-2" required />
                    </div>

                    <div className="flex items-center gap-2">
                      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                        <Check className="w-4 h-4" /> {editingGameId ? 'Save' : 'Create'}
                      </button>
                      <button type="button" onClick={() => { setShowGameForm(false); setEditingGameId(null); setGameForm({}); }} className="px-4 py-2 rounded-md border border-slate-300">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Apps list */}
            <div className="col-span-1 lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Apps ({apps.length})</h3>
                  <button
                    onClick={openNewAppForm}
                    className="text-sm text-pink-500 hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" /> New
                  </button>
                </div>

                {apps.length === 0 ? (
                  <p className="text-sm text-slate-500">No apps added yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {apps.map((a) => (
                      <li key={a.id} className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img src={a.image || 'https://via.placeholder.com/60x40?text=APP'} alt={a.title} className="w-16 h-10 object-cover rounded-md" />
                          <div>
                            <div className="font-medium text-slate-800">{a.title}</div>
                            <div className="text-xs text-slate-500">{a.downloads || '—'} • {a.size || '—'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button title="Edit" onClick={() => openEditAppForm(a)} className="p-2 rounded-md hover:bg-slate-100">
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>
                          <button title="Delete" onClick={() => deleteApp(a.id)} className="p-2 rounded-md hover:bg-slate-100">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {showAppForm && (
                <div className="mt-4 bg-white rounded-lg border border-slate-300 p-6">
                  <h4 className="text-lg font-semibold mb-3">{editingAppId ? 'Edit App' : 'Add New App'}</h4>
                  <form onSubmit={saveApp} className="space-y-3">
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Title</label>
                      <input value={appForm.title || ''} onChange={(e) => setAppForm({ ...appForm, title: e.target.value })} className="w-full border border-slate-300 rounded px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Description</label>
                      <textarea value={appForm.description || ''} onChange={(e) => setAppForm({ ...appForm, description: e.target.value })} className="w-full border border-slate-300 rounded px-3 py-2" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">Image URL</label>
                        <input value={appForm.image || ''} onChange={(e) => setAppForm({ ...appForm, image: e.target.value })} className="w-full border border-slate-300 rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">Category</label>
                        <input value={appForm.appCategory || ''} onChange={(e) => setAppForm({ ...appForm, appCategory: e.target.value })} className="w-full border border-slate-300 rounded px-3 py-2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input value={appForm.downloads || ''} onChange={(e) => setAppForm({ ...appForm, downloads: e.target.value })} placeholder="Downloads" className="border border-slate-300 rounded px-3 py-2" />
                      <input value={appForm.size || ''} onChange={(e) => setAppForm({ ...appForm, size: e.target.value })} placeholder="Size" className="border border-slate-300 rounded px-3 py-2" />
                      <input value={appForm.rating?.toString() || ''} onChange={(e) => setAppForm({ ...appForm, rating: Number(e.target.value) })} placeholder="Rating" className="border border-slate-300 rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Download URL</label>
                      <input value={appForm.downloadUrl || ''} onChange={(e) => setAppForm({ ...appForm, downloadUrl: e.target.value })} className="w-full border border-slate-300 rounded px-3 py-2" required />
                    </div>

                    <div className="flex items-center gap-2">
                      <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
                        <Check className="w-4 h-4" /> {editingAppId ? 'Save' : 'Create'}
                      </button>
                      <button type="button" onClick={() => { setShowAppForm(false); setEditingAppId(null); setAppForm({}); }} className="px-4 py-2 rounded-md border border-slate-300">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Ads manager */}
            <div className="col-span-1 lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Ad Slots ({ads.length})</h3>
                  <button onClick={openNewAdForm} className="text-sm text-green-600 hover:underline flex items-center gap-1">
                    <PlusCircle className="w-4 h-4" /> New
                  </button>
                </div>

                {ads.length === 0 ? (
                  <p className="text-sm text-slate-500">No ad slots configured yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {ads.map((ad) => (
                      <li key={ad.id} className="border border-slate-100 rounded p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-slate-800">{ad.zoneId}</div>
                            <div className="text-sm text-slate-500">{ad.width}x{ad.height} • {ad.active ? 'Active' : 'Inactive'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button title="Preview" className="p-2 rounded-md hover:bg-slate-100" onClick={() => openEditAdForm(ad)}>
                              <Eye className="w-4 h-4 text-slate-600" />
                            </button>
                            <button title="Delete" onClick={() => deleteAd(ad.id)} className="p-2 rounded-md hover:bg-slate-100">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="w-full bg-slate-50 border border-slate-100 rounded p-2 flex items-center justify-center">
                            <AdBanner zoneId={ad.zoneId} width={ad.width} height={ad.height} />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {showAdForm && (
                <div className="mt-4 bg-white rounded-lg border border-slate-300 p-6">
                  <h4 className="text-lg font-semibold mb-3">{editingAdId ? 'Edit Ad Slot' : 'Add Ad Slot'}</h4>
                  <form onSubmit={saveAd} className="space-y-3">
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Zone ID</label>
                      <input value={adForm.zoneId || ''} onChange={(e) => setAdForm({ ...adForm, zoneId: e.target.value })} className="w-full border border-slate-300 rounded px-3 py-2" required />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">Width</label>
                        <input type="number" value={adForm.width || 728} onChange={(e) => setAdForm({ ...adForm, width: Number(e.target.value) })} className="w-full border border-slate-300 rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">Height</label>
                        <input type="number" value={adForm.height || 90} onChange={(e) => setAdForm({ ...adForm, height: Number(e.target.value) })} className="w-full border border-slate-300 rounded px-3 py-2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={!!adForm.active} onChange={(e) => setAdForm({ ...adForm, active: e.target.checked })} />
                        <span className="text-sm text-slate-700">Active</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                        <Check className="w-4 h-4" /> {editingAdId ? 'Save' : 'Create'}
                      </button>
                      <button type="button" onClick={() => { setShowAdForm(false); setEditingAdId(null); setAdForm({ zoneId: '', width: 728, height: 90, active: true }); }} className="px-4 py-2 rounded-md border border-slate-300">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}