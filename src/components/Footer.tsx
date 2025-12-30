import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = 2025;

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'DMCA', href: '/dmca' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">APKVault</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Your trusted source for Android games and apps. Download safely with our verified APK files and enjoy the latest mobile entertainment.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-slate-400 hover:text-purple-400 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/games" className="text-slate-400 hover:text-purple-400 transition-colors">Popular Games</Link></li>
              <li><Link to="/apps" className="text-slate-400 hover:text-purple-400 transition-colors">Top Apps</Link></li>
              <li><Link to="/categories" className="text-slate-400 hover:text-purple-400 transition-colors">Categories</Link></li>
              <li><Link to="/new-releases" className="text-slate-400 hover:text-purple-400 transition-colors">New Releases</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-400 hover:text-purple-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} APKVault. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm mt-2 sm:mt-0">
            Made with ❤️ for Android enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;