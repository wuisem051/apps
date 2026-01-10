import React, { useState, useEffect } from 'react';
import { Download, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteContext';
import { useAnalytics } from '../context/AnalyticsContext';
import AdBanner from './AdBanner';

interface DownloadFlowProps {
  gameTitle: string;
  downloadUrl: string;
  onDownloadComplete: () => void;
}

export default function DownloadFlow({ gameTitle, downloadUrl, onDownloadComplete }: DownloadFlowProps) {
  const { downloadTimer: siteTimer } = useSiteSettings();
  const { trackEvent } = useAnalytics();

  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(siteTimer || 15);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasFollowed, setHasFollowed] = useState(false);

  useEffect(() => {
    // Step 3 is now the Countdown Step
    if (step === 3 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 3 && countdown === 0) {
      setStep(4);
    }
  }, [step, countdown]);

  const handleTikTokFollow = () => {
    window.open('https://www.tiktok.com/@inyectoryt', '_blank');
    setHasFollowed(true);
  };

  const handleStartFlow = () => {
    if (hasFollowed) {
      setStep(2);
    }
  };

  const handleStartDownload = () => {
    setCountdown(siteTimer || 15);
    setStep(3);
  };

  const handleVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(5);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg border border-slate-300 p-6 shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Download {gameTitle}</h2>
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${i <= step
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-400'
                }`}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <AdBanner placementId="download_step_1" className="my-0" />
            <AdBanner placementId="native_ad_1" className="my-0" />
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto text-white font-bold text-2xl shadow-lg">
              TT
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Support Us to Download</h3>
            <p className="text-slate-600">
              Please follow us on TikTok to unlock the download link. This helps us keep providing free content!
            </p>

            <button
              onClick={handleTikTokFollow}
              className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${hasFollowed ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-slate-800'}`}
            >
              {hasFollowed ? 'Followed ✓' : 'Follow on TikTok'}
            </button>

            <button
              onClick={handleStartFlow}
              disabled={!hasFollowed}
              className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${hasFollowed
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg cursor-pointer'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
              {hasFollowed ? 'Continue to Download' : 'Follow to Unlock'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <AdBanner placementId="download_step_2" className="my-0" />
            <AdBanner placementId="native_ad_1" className="my-0" />
          </div>

          <div className="space-y-4">
            <AlertCircle className="w-16 h-16 text-purple-600 mx-auto" />
            <h3 className="text-xl font-semibold text-slate-800">Prepare Download</h3>
            <p className="text-slate-600">
              Click the button below to start the server connection.
            </p>
            <button
              onClick={handleStartDownload}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
            >
              Start Download Process
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <AdBanner placementId="download_step_3" className="my-0" />
            <AdBanner placementId="native_ad_1" className="my-0" />
          </div>

          <div className="space-y-4">
            <Clock className="w-16 h-16 text-purple-600 mx-auto" />
            <h3 className="text-xl font-semibold text-slate-800">Please Wait</h3>
            <p className="text-slate-600">
              Generating secure link... {countdown} seconds remaining.
            </p>
            <div className="text-4xl font-black text-purple-600 font-mono">{countdown}</div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((siteTimer - countdown) / siteTimer) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <AdBanner placementId="download_step_4" className="my-0" />
            <AdBanner placementId="native_ad_1" className="my-0" />
          </div>

          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold text-slate-800">Final Verification</h3>
            <p className="text-slate-600">
              Verify you are human to proceed.
            </p>
            <button
              onClick={handleVerification}
              disabled={isVerifying}
              className="bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md w-full max-w-xs mx-auto"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <AdBanner placementId="download_step_5" className="my-0" />
            <AdBanner placementId="native_ad_1" className="my-0" />
          </div>

          <div className="space-y-4">
            <Download className="w-16 h-16 text-purple-600 mx-auto" />
            <h3 className="text-xl font-semibold text-slate-800">Download Ready!</h3>
            <p className="text-slate-600">
              Your file is ready. Click below to download.
            </p>
            <a
              href={downloadUrl}
              target="_blank"
              onClick={() => {
                trackEvent('download', { itemTitle: gameTitle });
                onDownloadComplete();
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-4 rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-green-100 flex items-center justify-center space-x-3 mb-4"
            >
              Download Now
            </a>
          </div>
        </div>
      )}
    </div>
  );
}