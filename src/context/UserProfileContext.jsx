import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const UserProfileContext = createContext();

// Provider component
export function UserProfileProvider({ children }) {
    const { currentUser } = useAuth();

    const [userProfile, setUserProfile] = useState(null);
    const [userProducts, setUserProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user's products and profile info
    const fetchUserProducts = async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const q = query(
                collection(db, 'products'),
                where('sellerId', '==', currentUser.uid)
            );
            const querySnapshot = await getDocs(q);

            const products = [];
            querySnapshot.forEach((doc) => {
                products.push({ id: doc.id, ...doc.data() });
            });

            setUserProducts(products);

            setUserProfile({
                name: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
                joinDate: currentUser.metadata.creationTime,
                rating: 4.5, 
            });
        } catch (error) {
            console.error("Failed to fetch user data", error);
        } finally {
            setLoading(false);
        }
    };

    // Run on user change
    useEffect(() => {
        fetchUserProducts();
    }, [currentUser]);

    const value = {
        userProfile,
        userProducts,
        loading,
        fetchUserProducts,
    };

    return (
        <UserProfileContext.Provider value={value}>
            {children}
        </UserProfileContext.Provider>
    );
}

// Hook to access context
export function useUserProfile() {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
}
