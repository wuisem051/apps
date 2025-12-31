import React, { createContext, useContext, useState, useEffect } from 'react';

type SiteSettings = {
    siteName: string;
    footerText: string;
};

type SiteContextType = SiteSettings & {
    updateSettings: (settings: Partial<SiteSettings>) => void;
};

const DEFAULT_SETTINGS: SiteSettings = {
    siteName: 'APKVault',
    footerText: '© 2025 APKVault. All rights reserved.',
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('site_settings_v1');
            if (saved) {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
            }
        } catch (err) {
            console.error('Failed to load site settings', err);
        }
    }, []);

    const updateSettings = (newSettings: Partial<SiteSettings>) => {
        setSettings(prev => {
            const next = { ...prev, ...newSettings };
            localStorage.setItem('site_settings_v1', JSON.stringify(next));
            return next;
        });
    };

    return (
        <SiteContext.Provider value={{ ...settings, updateSettings }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSiteSettings = () => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error('useSiteSettings must be used within a SiteProvider');
    }
    return context;
};
