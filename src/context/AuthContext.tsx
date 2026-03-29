import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
    user: User | { uid: string; displayName: string; email: string } | null;
    isLoading: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true, isAdmin: false });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | { uid: string; displayName: string; email: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = () => {
            const admin = localStorage.getItem('isAdmin') === 'true';
            setIsAdmin(admin);
            if (admin && !user) {
                setUser({
                    uid: 'admin-master',
                    displayName: 'Administrator (Master)',
                    email: 'admin@web.com'
                });
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
                setIsAdmin(false); // Reset admin if Firebase user logged in
            } else {
                checkAdmin();
                if (localStorage.getItem('isAdmin') !== 'true') {
                    setUser(null);
                }
            }
            setIsLoading(false);
        });

        // Monitor localStorage for admin changes
        const handleStorage = () => checkAdmin();
        window.addEventListener('storage', handleStorage);

        return () => {
            unsubscribe();
            window.removeEventListener('storage', handleStorage);
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, isLoading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
