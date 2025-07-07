import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../context/UserProfileContext';
import closeIcon from '../../assets/images/close.svg';
import userIcon from '../../assets/images/avatar.png';

// login and logout modal based on the state
const LoginModal = ({ onClose, currentUser }) => {
    const { loginWithGoogle, logout } = useAuth();
    const { userProfile, userProducts, loading } = useUserProfile();

    // Local state for email and password fields (not currently used for login)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handles Google login 
    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            onClose();
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    // Handles logout action
    const handleLogout = async () => {
        try {
            await logout();
            onClose();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                
                {/* Close modal button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
                >
                    <img src={closeIcon} alt="close" className="w-6 h-6" />
                </button>

                {/* Header section */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Welcome to OLX</h2>
                    <p className="text-gray-600">
                        {currentUser ? `Welcome back, ${currentUser.displayName || 'User'}` : 'Login to continue'}
                    </p>
                </div>

                {/* If user is logged in */}
                {currentUser ? (
                    <div className="space-y-4">

                        {/* User profile info */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                            <img 
                                src={currentUser.photoURL || userIcon} 
                                alt="user" 
                                className="w-10 h-10 rounded-full"
                                referrerPolicy="no-referrer"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">{userProfile?.name || 'User'}</p>
                                <p className="text-xs text-gray-500">{currentUser.email}</p>
                            </div>
                        </div>
                        
                        {/* Navigation to user account page */}
                        <a 
                            href="/my-account"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            onClick={onClose}
                        >
                            My Account
                        </a>
                        
                        {/* Product preview section */}
                        <div className="px-4 py-2 border-t border-b border-gray-200">
                            <h3 className="font-medium text-gray-700 mb-2 text-sm">Your Products</h3>
                            {loading ? (
                                <p className="text-sm text-gray-500">Loading...</p>
                            ) : userProducts && userProducts.length > 0 ? (
                                <>
                                    {/* Show up to 3 products */}
                                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                                        {userProducts.slice(0, 3).map(product => (
                                            <li key={product.id} className="flex justify-between text-sm">
                                                <span className="text-gray-700 truncate">{product.title}</span>
                                                <span className="text-teal-600 whitespace-nowrap">₹{product.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {/* Show if more than 3 products exist */}
                                    {userProducts.length > 3 && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            +{userProducts.length - 3} more products
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">No products listed yet</p>
                            )}
                        </div>

                        {/* Logout button */}
                        <button 
                            onClick={handleLogout}
                            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mt-4"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    // If user is not logged in
                    <div className="space-y-4">
                        
                        {/* Google login button */}
                        <button 
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814c-1.786-1.667-4.141-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-.667-.065-1.344-.195-2.001h-9.805z" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* OR divider */}
                        <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 text-gray-500">OR</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* Manual login form (currently not wired to backend) */}
                        <form className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Email or Phone Number" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button 
                                type="submit" 
                                className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginModal;
