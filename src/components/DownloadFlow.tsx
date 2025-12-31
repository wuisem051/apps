import React, { useState, useEffect } from 'react';
import { Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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

  useEffect(() => {
    // Reset countdown if timer setting changes, but only if we haven't started (optional refinement)
    // For now, simple init is enough, but let's sync it for step 2
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 2 && countdown === 0) {
      setStep(3);
    }
  }, [step, countdown]);

  const handleStartDownload = () => {
    setCountdown(siteTimer || 15); // Ensure we start with fresh timer
    setStep(2);
  };

  const handleVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(4);
    }, 2000);
  };

  const handleFinalDownload = () => {
    window.open(downloadUrl, '_blank');
    onDownloadComplete();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border border-slate-300 p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Download {gameTitle}</h2>
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step
                ? 'bg-purple-600 text-white'
                : 'bg-slate-200 text-slate-500'
                }`}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="text-center space-y-6">
          <AdBanner placementId="download_step_1" className="mb-4" />
          <div className="space-y-4">
            <AlertCircle className="w-16 h-16 text-purple-600 mx-auto" />
            <h3 className="text-xl font-semibold text-slate-800">Prepare Download</h3>
            <p className="text-slate-600">
              Click the button below to start the download process. Please wait for the verification steps to complete.
            </p>
            <button
              onClick={handleStartDownload}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start Download Process
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="text-center space-y-6">
          <AdBanner placementId="download_step_2" className="mb-4" />
          <div className="space-y-4">
            <Clock className="w-16 h-16 text-purple-600 mx-auto" />
            <h3 className="text-xl font-semibold text-slate-800">Please Wait</h3>
            <p className="text-slate-600">
              Preparing your download... Please wait {countdown} seconds.
            </p>
            <div className="text-3xl font-bold text-purple-600">{countdown}</div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((siteTimer - countdown) / siteTimer) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-6">
          <AdBanner placementId="download_step_3" className="mb-4" />
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold text-slate-800">Verification Required</h3>
            <p className="text-slate-600">
              Click the verification button to proceed with the download.
            </p>
            <button
              onClick={handleVerification}
              disabled={isVerifying}
              className="bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-center space-y-6">
          <AdBanner placementId="download_step_4" className="mb-4" />
          <div className="space-y-4">
            <Download className="w-16 h-16 text-purple-600 mx-auto" />
            <h3 className="text-xl font-semibold text-slate-800">Download Ready!</h3>
            <p className="text-slate-600">
              Your download is ready. Click the button below to start downloading {gameTitle}.
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