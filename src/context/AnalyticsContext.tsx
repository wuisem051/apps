import React, { createContext, useContext, useState, useEffect } from 'react';

export type EventType = 'visit' | 'view' | 'download';

export interface AnalyticsLog {
    id: string;
    timestamp: number;
    type: EventType;
    path: string;
    itemId?: string;
    itemTitle?: string;
    geo: {
        ip: string;
        country: string;
        city: string;
        region: string;
    };
    device: {
        browser: string;
        os: string;
        platform: string;
        screen: string;
    };
}

interface AnalyticsContextType {
    logs: AnalyticsLog[];
    trackEvent: (type: EventType, metadata?: { itemId?: string; itemTitle?: string }) => void;
    clearLogs: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<AnalyticsLog[]>(() => {
        const saved = localStorage.getItem('site_analytics_v1');
        return saved ? JSON.parse(saved) : [];
    });

    const [sessionGeo, setSessionGeo] = useState<AnalyticsLog['geo'] | null>(null);

    // Fetch Geo Info once per session
    useEffect(() => {
        const fetchGeo = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                setSessionGeo({
                    ip: data.ip || 'Unknown',
                    country: data.country_name || 'Unknown',
                    city: data.city || 'Unknown',
                    region: data.region || 'Unknown'
                });
            } catch (err) {
                console.error('Failed to fetch geo info', err);
                setSessionGeo({ ip: 'Hidden', country: 'Unknown', city: 'Unknown', region: 'Unknown' });
            }
        };
        fetchGeo();
    }, []);

    const getDeviceInfo = () => {
        const ua = navigator.userAgent;
        let browser = "Unknown";
        if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Edge")) browser = "Edge";

        let os = "Unknown";
        if (ua.includes("Windows")) os = "Windows";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
        else if (ua.includes("Mac OS")) os = "macOS";
        else if (ua.includes("Linux")) os = "Linux";

        return {
            browser,
            os,
            platform: navigator.platform || 'Unknown',
            screen: `${window.screen.width}x${window.screen.height}`
        };
    };

    const trackEvent = (type: EventType, metadata?: { itemId?: string; itemTitle?: string }) => {
        if (!sessionGeo) return; // Wait for geo or use default if failed

        const newLog: AnalyticsLog = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2),
            timestamp: Date.now(),
            type,
            path: window.location.pathname,
            itemId: metadata?.itemId,
            itemTitle: metadata?.itemTitle,
            geo: sessionGeo,
            device: getDeviceInfo()
        };

        setLogs(prev => {
            const updated = [newLog, ...prev].slice(0, 5000); // Keep last 5000 logs
            localStorage.setItem('site_analytics_v1', JSON.stringify(updated));
            return updated;
        });
    };

    const clearLogs = () => {
        setLogs([]);
        localStorage.removeItem('site_analytics_v1');
    };

    return (
        <AnalyticsContext.Provider value={{ logs, trackEvent, clearLogs }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) throw new Error('useAnalytics must be used within an AnalyticsProvider');
    return context;
};
