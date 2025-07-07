// context/UserProfileContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [soldProducts, setSoldProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const fetchUserData = async () => {
                setLoading(true);
                try {
                    const mockProfile = {
                        name: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL,
                        joinDate: new Date().toISOString(),
                        rating: 4.5,
                    };

                    const mockProducts = [
                        { id: 1, title: 'Used iPhone 12', price: 35000, date: '2023-05-15' },
                        { id: 2, title: 'Sony Headphones', price: 5000, date: '2023-06-20' },
                    ];

                    setUserProfile(mockProfile);
                    setSoldProducts(mockProducts);
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        } else {
            setUserProfile(null);
            setSoldProducts([]);
            setLoading(false);
        }
    }, [currentUser]);

    const value = {
        userProfile,
        soldProducts,
        loading,
    };

    return (
        <UserProfileContext.Provider value={value}>
            {children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfile() {
    return useContext(UserProfileContext);
}
