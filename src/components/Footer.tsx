import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook, Instagram } from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';

export default function Footer() {
  const { footerText } = useSiteSettings();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-lg font-bold text-white uppercase tracking-tight">APKVault</span>
            </div>
            <p className="text-slate-400 text-sm">
              Your trusted source for safe, verified Android games and apps. Download with confidence.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link to="/games" className="hover:text-purple-400 transition-colors">Games</Link></li>
              <li><Link to="/apps" className="hover:text-purple-400 transition-colors">Apps</Link></li>
              <li><Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/dmca" className="hover:text-purple-400 transition-colors">DMCA</Link></li>
              <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-white">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center sm:flex sm:justify-between sm:text-left">
          <p className="text-slate-400 text-sm">
            {footerText}
          </p>
          <div className="mt-4 sm:mt-0">
            <p className="text-slate-500 text-xs">
              Designed with <span className="text-red-500">♥</span> for Android users
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}