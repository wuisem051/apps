import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export type AdPlacement = {
    id: string;
    name: string;
    type: 'zone' | 'script';
    value: string;
    width: number;
    height: number;
    active: boolean;
};

type SiteSettings = {
    siteName: string;
    footerText: string;
    downloadTimer: number;
    adPlacements: Record<string, AdPlacement>;
    homeHero: { title: string; subtitle: string; };
    footerPages: any[];
    language: 'en' | 'es';
    headCode: string;
    footerCode: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
    siteName: 'PASTE INYECTOR',
    footerText: '© 2026 PASTE INYECTOR. All rights reserved.',
    downloadTimer: 15,
    adPlacements: {
        'paste_view_top': {
            id: 'paste_view_top',
            name: 'Paste View Top Banner',
            type: 'zone',
            value: '',
            width: 728,
            height: 90,
            active: false
        }
    },
    homeHero: { title: 'Welcome to Paste Inyector', subtitle: 'Public paste for community content' },
    footerPages: [],
    language: 'es',
    headCode: '',
    footerCode: ''
};

const SiteContext = createContext<any>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!db) return;
        try {
            const globalRef = doc(db, 'settings', 'global');
            const unsub = onSnapshot(globalRef, (snap) => {
                if (snap.exists()) {
                    const data = snap.data() as SiteSettings;
                    // Ensure default placements exist if not in Firestore
                    const adPlacements = { ...DEFAULT_SETTINGS.adPlacements, ...(data.adPlacements || {}) };
                    setSettings({ ...data, adPlacements });
                }
                setIsLoading(false);
            }, (err) => {
                console.warn("Firestore access error in SiteProvider:", err);
                setIsLoading(false);
            });
            return unsub;
        } catch (e) {
            console.error("Failed to initialize SiteProvider listener:", e);
            setIsLoading(false);
        }
    }, []);

    const updateSettings = async (s: any) => {
        const globalRef = doc(db, 'settings', 'global');
        await setDoc(globalRef, { ...settings, ...s }, { merge: true });
    };

    const updateAdPlacement = async (id: string, ad: Partial<AdPlacement>) => {
        const newPlacements = { ...settings.adPlacements, [id]: { ...settings.adPlacements[id], ...ad, id } };
        await updateSettings({ adPlacements: newPlacements });
    };

    return (
        <SiteContext.Provider value={{ ...settings, updateSettings, updateAdPlacement, isLoading }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSiteSettings = () => useContext(SiteContext);
