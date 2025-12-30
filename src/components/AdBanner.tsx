import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  zoneId: string;
  width?: number;
  height?: number;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  zoneId, 
  width = 728, 
  height = 90, 
  className = '' 
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Adsterra banner ad implementation
    if (adRef.current && window.atOptions) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.topcreativeformat.com/${zoneId}/invoke.js`;
      script.async = true;
      adRef.current.appendChild(script);
    }
  }, [zoneId]);

  return (
    <div className={`flex justify-center items-center bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
      <div 
        ref={adRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="flex items-center justify-center"
      >
        {/* Fallback content while ad loads */}
        <div className="text-slate-400 text-sm">Advertisement</div>
      </div>
    </div>
  );
};

export default AdBanner;