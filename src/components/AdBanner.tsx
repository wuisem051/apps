import React, { useEffect, useRef } from 'react';
import { useSiteSettings } from '../context/SiteContext';

interface AdBannerProps {
  placementId: string;
  className?: string;
  // Fallbacks used if placement not found in context
  fallbackWidth?: number;
  fallbackHeight?: number;
}

const AdBanner: React.FC<AdBannerProps> = ({
  placementId,
  className = '',
  fallbackWidth = 300,
  fallbackHeight = 250
}) => {
  const { adPlacements } = useSiteSettings();
  const config = adPlacements?.[placementId];
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!config || !config.active || !adRef.current) return;

    // Clear previous content
    adRef.current.innerHTML = '';

    if (config.type === 'zone' && config.value) {
      // Adsterra Zone Logic
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.topcreativeformat.com/${config.value}/invoke.js`;
      script.async = true;

      // Adsterra options usually need to be global, but if the script is standard invoke.js, 
      // it might rely on having the container specifically or just global options.
      // Standard Adsterra: sets global 'atOptions'. This is tricky with multiple banners.
      // We will assume the simplified invoke URL pattern or just render iframe if possible.
      // Reverting to standard safe script injection:

      const optionsScript = document.createElement('script');
      optionsScript.type = "text/javascript";
      optionsScript.text = `
        atOptions = {
          'key' : '${config.value}',
          'format' : 'iframe',
          'height' : ${config.height},
          'width' : ${config.width},
          'params' : {}
        };
      `;
      // Check if we already have atOptions - actually Adsterra uses unique keys per zone usually.
      // If we use the simple invoke.js from the previous code:
      // //www.topcreativeformat.com/${zoneId}/invoke.js
      // It likely handles it. Let's stick to the previous simple implementation + script injection.

      adRef.current.appendChild(script);

    } else if (config.type === 'script' && config.value) {
      // Custom Script Logic
      // Create a range to fragment mechanism to execute scripts
      try {
        const range = document.createRange();
        range.selectNode(adRef.current);
        const documentFragment = range.createContextualFragment(config.value);
        adRef.current.appendChild(documentFragment);
      } catch (e) {
        console.error('Failed to inject ad script', e);
        adRef.current.textContent = 'Ad Error';
      }
    }
  }, [config]);

  if (!config || !config.active) return null;

  return (
    <div className={`flex justify-center items-center my-4 ${className}`}>
      <div
        ref={adRef}
        style={{ width: `${config.width || fallbackWidth}px`, height: `${config.height || fallbackHeight}px` }}
        className="bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden"
      >
        {!config.value && <div className="text-slate-400 text-xs text-center p-2">Ad Space<br />({placementId})</div>}
      </div>
    </div>
  );
};

export default AdBanner;