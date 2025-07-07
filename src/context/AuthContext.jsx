import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { signInWithGoogle, signOutUser } from '../../firebase';

// Create a React Context for authentication state
const AuthContext = createContext();

// AuthProvider wraps the app and provides auth data/methods to all child components
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null); 
    const [loading, setLoading] = useState(true);        

    // Sign in using Google popup
    const loginWithGoogle = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Login failed", error);
            throw error; 
        }
    };

    // Log the user out
    const logout = async () => {
        try {
            await signOutUser();
        } catch (error) {
            console.error("Logout failed", error);
            throw error;
        }
    };

    // Listen to Firebase Auth state changes on mount
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);   
            setLoading(false);     
        });

		return unsubscribe;
    }, []);

    // Shared context value for consumers
    const value = {
        currentUser,
        loginWithGoogle,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Prevent rendering children until Firebase auth state is resolved */}
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Custom hook to access the AuthContext
export function useAuth() {
    return useContext(AuthContext);
}
