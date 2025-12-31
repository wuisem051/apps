import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALL_GAMES } from '../data/mockData';

export interface Game {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    image: string;
    screenshots?: string[];
    rating: number;
    downloads: string;
    size: string;
    version: string;
    category: string;
    developer: string;
    requirements: string;
    releaseDate?: string;
    downloadUrl: string;
    createdAt: number;
}

export type AppItem = Omit<Game, 'category'> & { appCategory?: string };

interface ContentContextType {
    games: Game[];
    apps: AppItem[];
    addGame: (game: Game) => void;
    updateGame: (game: Game) => void;
    deleteGame: (id: string) => void;
    addApp: (app: AppItem) => void;
    updateApp: (app: AppItem) => void;
    deleteApp: (id: string) => void;
}

const LS_KEYS = {
    GAMES: 'admin_games_v3', // Incremented version to ensure fresh data structure
    APPS: 'admin_apps_v3'
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [games, setGames] = useState<Game[]>(() => {
        const saved = localStorage.getItem(LS_KEYS.GAMES);
        if (!saved) {
            return ALL_GAMES
                .filter(g => !['Social', 'Music'].includes(g.category))
                .map((g, i) => ({ ...g, createdAt: Date.now() - (i * 1000 * 60 * 60) })) as Game[];
        }
        return JSON.parse(saved);
    });

    const [apps, setApps] = useState<AppItem[]>(() => {
        const saved = localStorage.getItem(LS_KEYS.APPS);
        if (!saved) {
            return ALL_GAMES
                .filter(g => ['Social', 'Music'].includes(g.category))
                .map((g, i) => ({
                    ...g,
                    appCategory: g.category,
                    createdAt: Date.now() - (i * 1000 * 60 * 60)
                })) as AppItem[];
        }
        return JSON.parse(saved);
    });

    useEffect(() => {
        localStorage.setItem(LS_KEYS.GAMES, JSON.stringify(games));
    }, [games]);

    useEffect(() => {
        localStorage.setItem(LS_KEYS.APPS, JSON.stringify(apps));
    }, [apps]);

    const addGame = (game: Game) => setGames(prev => [game, ...prev]);
    const updateGame = (game: Game) => setGames(prev => prev.map(g => g.id === game.id ? game : g));
    const deleteGame = (id: string) => setGames(prev => prev.filter(g => g.id !== id));

    const addApp = (app: AppItem) => setApps(prev => [app, ...prev]);
    const updateApp = (app: AppItem) => setApps(prev => prev.map(a => a.id === app.id ? app : a));
    const deleteApp = (id: string) => setApps(prev => prev.filter(a => a.id !== id));

    return (
        <ContentContext.Provider value={{
            games,
            apps,
            addGame,
            updateGame,
            deleteGame,
            addApp,
            updateApp,
            deleteApp
        }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) throw new Error('useContent must be used within a ContentProvider');
    return context;
};
