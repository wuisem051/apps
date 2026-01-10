import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';
import { ExternalLink, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { translations } from '../data/translations';

export default function Redirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { downloadTimer: siteTimer, language } = useSiteSettings();
  const { trackEvent } = useAnalytics();
  const t = translations[language] || translations['en'];

  const queryParams = new URLSearchParams(location.search);
  const targetUrl = queryParams.get('url');

  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(siteTimer || 15);
  const [isVerifying, setIsVerifying] = useState(false);

  const [hasFollowed, setHasFollowed] = useState(false);

  useEffect(() => {
    if (targetUrl) {
      trackEvent('redirect', { itemId: `step_${step}`, itemTitle: targetUrl });
    }
  }, [step, targetUrl, trackEvent]);

  useEffect(() => {
    if (!targetUrl) {
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    // Step 3 is now the countdown (Security Check)
    if (step === 3 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 3 && countdown === 0) {
      setStep(4);
    }

    // Step 5 auto-advance (Server Handshake)
    if (step === 5) {
      const timer = setTimeout(() => setStep(6), 3000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown, targetUrl, navigate]);

  const handleTikTokFollow = () => {
    window.open('https://www.tiktok.com/@inyectoryt', '_blank');
    setHasFollowed(true);
  };

  const handleStart = () => {
    // Current Step 1 (TikTok) -> Next Step 2 (Prepare Link)
    if (hasFollowed) {
      setStep(2);
    }
  };

  const handlePrepare = () => {
    // Current Step 2 (Prepare) -> Next Step 3 (Countdown)
    setStep(3);
  };

  const handleVerify = () => {
    // Current Step 4 (Human Verify) -> Next Step 5 (Handshake)
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(5);
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
              <h1 className="text-2xl font-bold text-slate-800 mb-2">{t.redirect.invalidLink}</h1>
              <p className="text-slate-600 mb-6">{t.redirect.invalidLinkDesc}</p>
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
          <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">{t.redirect.title}</h1>
          <p className="text-slate-500 font-medium">{t.redirect.subtitle}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 pb-12 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-inner">
                <ExternalLink className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="inline-flex px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-2 border border-white/10">
                  {t.redirect.step} {step} {t.redirect.of} 6
                </div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">{t.redirect.externalResource}</h1>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
                  <AdBanner placementId="download_step_1" className="mb-8" />
                  <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">REQUIRED</span>
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-purple-600 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">{t.redirect.tiktokStepTitle}</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">{t.redirect.tiktokStepDesc}</p>
                  </div>

                  <div className="flex flex-col gap-4 max-w-md mx-auto">
                    <button
                      onClick={handleTikTokFollow}
                      className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 ${hasFollowed ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-slate-900 shadow-slate-200'}`}
                    >
                      {hasFollowed ? (
                        <>
                          <span>{t.redirect.tiktokFollowed}</span>
                          <div className="bg-white rounded-full p-1"><ArrowRight className="w-4 h-4 text-green-500" /></div>
                        </>
                      ) : (
                        <span>{t.redirect.followTikTok}</span>
                      )}
                    </button>

                    <button
                      onClick={handleStart}
                      disabled={!hasFollowed}
                      className={`w-full py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${hasFollowed
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xl hover:shadow-purple-200 cursor-pointer'
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                      {t.redirect.processRedirect}
                      <ArrowRight className={`w-6 h-6 transition-transform ${hasFollowed ? 'group-hover:translate-x-1' : ''}`} />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AdBanner placementId="download_step_2" className="mb-8" />
                  <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-12 h-12 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">{t.redirect.prepareLink}</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">{t.redirect.prepareLinkDesc}</p>
                  </div>
                  <button
                    onClick={handlePrepare}
                    className="group w-full max-w-md mx-auto bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-xl hover:shadow-purple-200 flex items-center justify-center gap-3"
                  >
                    {t.redirect.processRedirect}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AdBanner placementId="download_step_3" className="mb-8" />
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
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.redirect.verifying}</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">{t.redirect.securityCheck}</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">{t.redirect.securityCheckDesc}</p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
                    <AdBanner placementId="download_step_4" className="my-0" />
                    <AdBanner placementId="native_ad_1" className="my-0" />
                  </div>
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-12 h-12 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">{t.redirect.humanVerification}</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">{t.redirect.humanVerificationDesc}</p>
                  </div>
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-xl hover:shadow-blue-200 flex items-center justify-center gap-3"
                  >
                    {isVerifying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t.redirect.verifyingAction}
                      </div>
                    ) : (
                      t.redirect.verifyContinue
                    )}
                  </button>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AdBanner placementId="download_step_5" className="mb-8" />
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">{t.redirect.step5Title}</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">{t.redirect.step5Desc}</p>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
                    <AdBanner placementId="download_step_6" className="my-0" />
                    <AdBanner placementId="native_ad_1" className="my-0" />
                  </div>
                  <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl">
                    <ExternalLink className="w-16 h-16 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                      {t.redirect.systemReady}
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{t.redirect.destinationLoaded}</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">{t.redirect.destinationLoadedDesc}</p>
                  </div>
                  <button
                    onClick={handleRedirect}
                    className="group w-full max-w-md mx-auto bg-gradient-to-r from-slate-900 to-slate-800 hover:from-purple-700 hover:to-purple-600 text-white py-8 rounded-[2rem] font-black text-2xl uppercase tracking-widest transition-all shadow-2xl hover:shadow-purple-200 flex items-center justify-center gap-4"
                  >
                    <span>{t.redirect.continueLink}</span>
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{t.redirect.sponsoredResources}</h3>
                <AdBanner placementId="game_detail_banner_1" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
            {t.redirect.safeRedirectNotice}
          </p>
        </div>

        <div className="space-y-6 mt-8">
          <AdBanner placementId="game_detail_sidebar_1" className="rounded-2xl border border-slate-200" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
