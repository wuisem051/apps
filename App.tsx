import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './src/pages/Home';
import Games from './src/pages/Games';
import Apps from './src/pages/Apps';
import Categories from './src/pages/Categories';
import Admin from './src/pages/Admin';
import GameDetail from './src/pages/GameDetail';
import StaticPage from './src/pages/StaticPage';
import Redirect from './src/pages/Redirect';
import PlayPaste from './src/pages/PlayPaste';
import PasteView from './src/pages/PasteView';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import NotFound from './src/pages/NotFound';

import { AuthProvider } from './src/context/AuthContext';
import { SiteProvider } from './src/context/SiteContext';
import { ContentProvider } from './src/context/ContentContext';
import { AnalyticsProvider } from './src/context/AnalyticsContext';
import CodeInjector from './src/components/CodeInjector';

const App: React.FC = () => {
  return (
    <AnalyticsProvider>
      <ContentProvider>
        <SiteProvider>
          <AuthProvider>
            <CodeInjector />
            <Theme appearance="inherit" radius="large" scaling="100%">
              <Router>
                <main className="min-h-screen font-inter">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/apps" element={<Apps />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/dev" element={<Admin />} />
                    <Route path="/game/:slug" element={<GameDetail />} />
                    <Route path="/p/:slug" element={<StaticPage />} />
                    <Route path="/redirect" element={<Redirect />} />
                    <Route path="/playpaste" element={<PlayPaste />} />
                    <Route path="/v/:id" element={<PasteView />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                  />
                </main>
              </Router>
            </Theme>
          </AuthProvider>
        </SiteProvider>
      </ContentProvider>
    </AnalyticsProvider>
  );
}

export default App;