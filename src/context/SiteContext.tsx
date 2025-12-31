import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdPlacement = {
    id: string;
    name: string;
    type: 'zone' | 'script';
    value: string; // zoneId or script code
    width: number;
    height: number;
    active: boolean;
};

export type FooterPage = {
    slug: string;
    title: string;
    content: string;
};

type SiteSettings = {
    siteName: string;
    footerText: string;
    downloadTimer: number;
    adPlacements: Record<string, AdPlacement>;
    homeHero: {
        title: string;
        subtitle: string;
    };
    footerPages: FooterPage[];
};

type SiteContextType = SiteSettings & {
    updateSettings: (settings: Partial<SiteSettings>) => void;
    updateAdPlacement: (id: string, placement: Partial<AdPlacement>) => void;
};

const DEFAULT_PLACEMENTS: Record<string, AdPlacement> = {
    'home_banner_1': { id: 'home_banner_1', name: 'Home Banner Top', type: 'zone', value: '', width: 728, height: 90, active: true },
    'home_banner_2': { id: 'home_banner_2', name: 'Home Banner Bottom', type: 'zone', value: '', width: 728, height: 90, active: true },
    'games_banner_1': { id: 'games_banner_1', name: 'Games List Banner', type: 'zone', value: '', width: 728, height: 90, active: true },
    'apps_banner_1': { id: 'apps_banner_1', name: 'Apps List Banner', type: 'zone', value: '', width: 728, height: 90, active: true },
    'game_detail_banner_1': { id: 'game_detail_banner_1', name: 'Game Detail Main', type: 'zone', value: '', width: 728, height: 90, active: true },
    'game_detail_sidebar_1': { id: 'game_detail_sidebar_1', name: 'Game Detail Sidebar 1', type: 'zone', value: '', width: 300, height: 250, active: true },
    'game_detail_sidebar_2': { id: 'game_detail_sidebar_2', name: 'Game Detail Sidebar 2', type: 'zone', value: '', width: 300, height: 250, active: true },
    'download_step_1': { id: 'download_step_1', name: 'Download Step 1', type: 'zone', value: '', width: 300, height: 250, active: true },
    'download_step_2': { id: 'download_step_2', name: 'Download Step 2', type: 'zone', value: '', width: 300, height: 250, active: true },
    'download_step_3': { id: 'download_step_3', name: 'Download Step 3', type: 'zone', value: '', width: 300, height: 250, active: true },
    'download_step_4': { id: 'download_step_4', name: 'Download Step 4 (Final)', type: 'zone', value: '', width: 300, height: 250, active: true },
};

const DEFAULT_SETTINGS: SiteSettings = {
    siteName: 'APKVault',
    footerText: '© 2025 APKVault. All rights reserved.',
    downloadTimer: 15,
    adPlacements: DEFAULT_PLACEMENTS,
    homeHero: {
        title: 'Download Android Games & Apps',
        subtitle: 'Discover thousands of free Android games and apps. Safe, fast downloads with no registration required.'
    },
    footerPages: [
        { slug: 'privacy', title: 'Privacy Policy', content: '# Privacy Policy\n\nYour privacy is important to us...' },
        { slug: 'terms', title: 'Terms of Service', content: '# Terms of Service\n\nBy using our site, you agree to these terms...' },
        { slug: 'dmca', title: 'DMCA', content: '# DMCA Policy\n\nWe respect intellectual property rights...' },
        { slug: 'contact', title: 'Contact Us', content: '# Contact Us\n\nYou can reach us at contact@apkvault.com' }
    ]
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

    const updateAdPlacement = (id: string, placement: Partial<AdPlacement>) => {
        setSettings(prev => {
            const currentPlacements = prev.adPlacements || DEFAULT_PLACEMENTS;
            const updatedPlacements = {
                ...currentPlacements,
                [id]: { ...currentPlacements[id], ...placement }
            };
            const next = { ...prev, adPlacements: updatedPlacements };
            localStorage.setItem('site_settings_v1', JSON.stringify(next));
            return next;
        });
    };

    return (
        <SiteContext.Provider value={{ ...settings, updateSettings, updateAdPlacement }}>
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
