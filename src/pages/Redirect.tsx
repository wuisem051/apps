import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';
import { ExternalLink, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';

export default function Redirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { downloadTimer: siteTimer } = useSiteSettings();
  
  const queryParams = new URLSearchParams(location.search);
  const targetUrl = queryParams.get('url');

  const [countdown, setCountdown] = useState(siteTimer || 15);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!targetUrl) {
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown, targetUrl, navigate]);

  const handleRedirect = () => {
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  };

  if (!targetUrl) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="py-20">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Invalid Link</h1>
              <p className="text-slate-600 mb-6">The redirect link is missing or invalid. Returning to home...</p>
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
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">External Link Redirect</h1>
            <p className="text-slate-500 font-medium">You are being redirected to an external site</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-8 md:p-12 text-center">
                <AdBanner placementId="redirect_top" className="mb-8" />
                
                {!isReady ? (
                  <div className="space-y-6">
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="60"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-slate-100"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="60"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={377}
                          strokeDashoffset={377 - (377 * (siteTimer - countdown)) / siteTimer}
                          className="text-purple-600 transition-all duration-1000 ease-linear"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-800">{countdown}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Seconds</span>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Please Wait...</h2>
                      <p className="text-slate-500">We are processing your link. Do not close this page.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3">
                      <Clock className="w-5 h-5 text-purple-500 animate-pulse" />
                      <span className="text-sm font-bold text-slate-600">Generating Secure Redirect</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ExternalLink className="w-12 h-12 text-green-600" />
                    </div>
                    
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2">Link Ready!</h2>
                      <p className="text-slate-500 mb-8">Your destination is ready. Click the button below to continue.</p>
                    </div>

                    <button
                      onClick={handleRedirect}
                      className="group relative w-full bg-slate-900 hover:bg-purple-700 text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-2xl hover:shadow-purple-200 active:scale-[0.98]"
                    >
                      <div className="flex items-center justify-center gap-3">
                        Continue to Destination
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                    
                    <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      SSL Secured Connection
                    </div>
                  </div>
                )}

                <AdBanner placementId="redirect_bottom" className="mt-8" />
              </div>
            </div>
            
            <div className="space-y-6">
               <AdBanner placementId="redirect_sidebar" className="rounded-2xl border border-slate-200" />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
