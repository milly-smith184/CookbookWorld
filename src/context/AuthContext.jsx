import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';

/* Provides authentication information throughout the application */
export function AuthProvider({ children }) {

    /* Stores the currently logged-in user */
    const [user, setUser] = useState(null);

    /* Tracks whether the initial session check is complete */
    const [loading, setLoading] = useState(true);

    /* Checks whether a user currently has an active session */
    const refreshUser = async () => {
        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include'
            });

        if (response.status === 401) {
           setUser(null);
           return null;
        }

        if (!response.ok) {
           throw new Error("Unable to retrieve user session.");
        }

            const data = await response.json();
            setUser(data.user);

            return data.user;

        } catch (error) {
            console.error('Unable to check user session:', error);
            setUser(null);
            return null;

        } finally {
            setLoading(false);
        }
    };

    /* Checks the session when the application first loads */
    useEffect(() => {
        refreshUser();
    }, []);

    /* Logs out the current user and destroys their session */
    const logout = async () => {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Unable to log out.');
        }

        setUser(null);
    };

    /* Shares authentication information with child components */
    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            refreshUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}
