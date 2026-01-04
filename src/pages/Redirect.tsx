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

  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(siteTimer || 15);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!targetUrl) {
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 2 && countdown === 0) {
      setStep(3);
    }
  }, [step, countdown, targetUrl, navigate]);

  const handleStart = () => {
    setStep(2);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(4);
    }, 2000);
  };

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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">External Link Redirect</h1>
          <p className="text-slate-500 font-medium">You are being redirected to an external site</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 pb-12 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-inner">
                <ExternalLink className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="inline-flex px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-2 border border-white/10">
                  Step {step} of 4
                </div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">External Resource</h1>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black border-2 transition-all ${i === step
                      ? 'bg-white text-purple-600 border-white shadow-lg scale-110'
                      : i < step
                        ? 'bg-purple-500/50 text-white border-white/20'
                        : 'bg-transparent text-white/50 border-white/10'
                    }`}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 -mt-6">
            <div className="bg-white rounded-3xl p-10 border border-slate-50 shadow-xl text-center">

              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AdBanner placementId="redirect_step_1" className="mb-8" />
                  <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-12 h-12 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Prepare Your Link</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">Click the button below to start the secure redirection process.</p>
                  </div>
                  <button
                    onClick={handleStart}
                    className="group w-full max-w-md mx-auto bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-xl hover:shadow-purple-200 flex items-center justify-center gap-3"
                  >
                    Process Redirect
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AdBanner placementId="redirect_step_2" className="mb-8" />
                  <div className="relative w-40 h-40 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                      <circle
                        cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * (siteTimer - countdown)) / siteTimer}
                        className="text-purple-600 transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-slate-800 tracking-tighter">{countdown}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verifying</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Security Check...</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">We are generating a secure tunnel for your destination link.</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AdBanner placementId="redirect_step_3" className="mb-8" />
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-12 h-12 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Human Verification</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">Please confirm that you want to proceed to the external destination.</p>
                  </div>
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-xl hover:shadow-blue-200 flex items-center justify-center gap-3"
                  >
                    {isVerifying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify & Continue"
                    )}
                  </button>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AdBanner placementId="redirect_step_4" className="mb-8" />
                  <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl">
                    <ExternalLink className="w-16 h-16 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                      System Ready
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Destination Loaded!</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">Link verified successfully. You can now proceed safely.</p>
                  </div>
                  <button
                    onClick={handleRedirect}
                    className="group w-full max-w-md mx-auto bg-gradient-to-r from-slate-900 to-slate-800 hover:from-purple-700 hover:to-purple-600 text-white py-8 rounded-[2rem] font-black text-2xl uppercase tracking-widest transition-all shadow-2xl hover:shadow-purple-200 flex items-center justify-center gap-4"
                  >
                    <span>Continue to Link</span>
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Sponsored Resources</h3>
                <AdBanner placementId="redirect_bottom" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
            You are being redirected safely by InyectYT Secure Link Tunnel.
            All external connections are checked for security.
          </p>
        </div>

        <div className="space-y-6 mt-8">
          <AdBanner placementId="redirect_sidebar" className="rounded-2xl border border-slate-200" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
