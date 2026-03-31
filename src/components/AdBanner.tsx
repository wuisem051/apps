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

    const container = adRef.current;

    // Clear previous content
    container.innerHTML = '';

    if (config.type === 'zone' && config.value) {
      // Adsterra Zone Logic
      try {
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
        container.appendChild(optionsScript);

        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        // Use standard banner domain for identified banner sizes, otherwise fallback to topcreative
        const useBannerDomain = (config.width === 728 && config.height === 90) || (config.width === 300 && config.height === 250);
        invokeScript.src = `//www.${useBannerDomain ? 'profitabledisplaynetwork' : 'topcreativeformat'}.com/${config.value}/invoke.js`;
        invokeScript.async = true;
        container.appendChild(invokeScript);
      } catch (e) {
        console.error('Failed to inject Adsterra script', e);
      }
    } else if (config.type === 'script' && config.value) {
      // Custom Script Logic
      try {
        const range = document.createRange();
        range.selectNode(container);
        const documentFragment = range.createContextualFragment(config.value);
        container.appendChild(documentFragment);
      } catch (e) {
        console.error('Failed to inject ad script', e);
        container.textContent = 'Ad Error';
      }
    }

    // Cleanup function to prevent removeChild errors on unmount/re-render
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [config, placementId]);

  if (!config || !config.active) return null;

  return (
    <div className={`flex justify-center items-center my-4 w-full ${className}`}>
      <div
        style={{
          width: '100%',
          maxWidth: `${config.width || fallbackWidth}px`,
          height: `${config.height || fallbackHeight}px`,
          minHeight: '50px'
        }}
        className="bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden relative rounded-lg shadow-inner"
      >
        {/* Visible placeholder when active to help admin verify it's there */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Publicidad</div>
          <div className="text-[8px] font-bold text-slate-300">({placementId})</div>
        </div>

        {/* Ad Container - Script will inject content here */}
        <div ref={adRef} className="absolute inset-0 z-10 flex items-center justify-center bg-transparent" />
      </div>
    </div>
  );
};

export default AdBanner;