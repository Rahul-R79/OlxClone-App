import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SellForm from '../SellForm/SellForm';
import LoginModal from '../LoginModal/LoginModal';
import logo from '../../assets/images/symbol.png';
import searchwt from '../../assets/images/search1.svg';
import userIcon from '../../assets/images/avatar.png';
import sellButtonImage from '../../assets/images/addButton.png';
import menuIcon from '../../assets/images/menu.png';
import closeMenuIcon from '../../assets/images/close.svg';

function Navbar() {
    const { currentUser } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSellForm, setShowSellForm] = useState(false);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest('.mobile-menu-button')
            ) {
                setShowMobileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    const handleSellButtonClick = () => {
        if (!currentUser) {
            setShowLoginModal(true);
            setShowMobileMenu(false);
            return;
        }
        setShowSellForm(true);
        setShowMobileMenu(false);
    };

    return (
        <div className="relative">
            {/* Login Modal */}
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    currentUser={currentUser}
                />
            )}

            {/* Sell Form Modal */}
            {showSellForm && currentUser && (
                <SellForm onClose={() => setShowSellForm(false)} />
            )}

            {/* Navbar */}
            <nav className="fixed z-40 w-full shadow-md bg-slate-100 border-b-4 border-white">
                <div className="flex flex-col xl:flex-row items-center justify-between gap-4 p-4 max-w-7xl mx-auto w-full">

                    {/* Logo + Mobile Menu Toggle */}
                    <div className="flex items-center justify-between w-full xl:w-auto">
                        <div className="flex-shrink-0">
                            <img
                                src={logo}
                                alt="olx logo"
                                className="w-12 h-auto hover:scale-105 transition-transform cursor-pointer"
                            />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="mobile-menu-button xl:hidden p-2 rounded-md hover:bg-gray-200"
                            onClick={toggleMobileMenu}
                            aria-label={showMobileMenu ? "Close menu" : "Open menu"}
                        >
                            <img
                                src={showMobileMenu ? closeMenuIcon : menuIcon}
                                alt={showMobileMenu ? "close menu" : "menu"}
                                className="w-6 h-6"
                            />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full xl:flex-grow xl:max-w-3xl">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Find Cars, Mobile Phones and more..."
                                className="w-full p-3 pl-5 pr-12 border-black border-2 rounded-md focus:outline-none focus:border-teal-300 hover:border-teal-200 transition-colors"
                            />
                            <div className="absolute right-0 top-0 h-full px-4 bg-teal-500 rounded-r-md flex items-center justify-center">
                                <img src={searchwt} alt="search" className="w-5 h-5 invert" />
                            </div>
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden xl:flex items-center gap-4">
                        {/* Language */}
                        <p className="font-medium text-gray-700">English</p>

                        {/* User Button */}
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="flex items-center gap-1 p-2 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            <img
                                src={currentUser?.photoURL || userIcon}
                                alt="user"
                                className="w-8 h-8 rounded-full"
                                referrerPolicy="no-referrer"
                            />
                            <span className="font-medium text-gray-700">
                                {currentUser ? currentUser.displayName?.split(' ')[0] || 'User' : 'Login'}
                            </span>
                        </button>

                        {/* Sell Button */}
                        <button
                            className="p-0 border-none bg-transparent hover:opacity-90 transition-opacity"
                            aria-label="Sell"
                            onClick={handleSellButtonClick}
                        >
                            <img
                                src={sellButtonImage}
                                alt="Sell"
                                className="h-10 w-auto object-contain"
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div
                        ref={mobileMenuRef}
                        className="xl:hidden bg-white shadow-lg w-full absolute left-0 z-40 border-t border-gray-200"
                        style={{ top: '100%' }}
                    >
                        <div className="p-4 space-y-4">
                            {/* Language */}
                            <p className="font-medium text-gray-700 p-2">English</p>

                            {/* User Button */}
                            <button
                                onClick={() => {
                                    setShowLoginModal(true);
                                    setShowMobileMenu(false);
                                }}
                                className="flex items-center gap-2 p-2 w-full text-left hover:bg-gray-100 rounded-md"
                            >
                                <img
                                    src={currentUser?.photoURL || userIcon}
                                    alt="user"
                                    className="w-6 h-6 rounded-full"
                                    referrerPolicy="no-referrer"
                                />
                                <span className="font-medium text-gray-700">
                                    {currentUser ? currentUser.displayName?.split(' ')[0] || 'User' : 'Login'}
                                </span>
                            </button>

                            {/* Sell Button */}
                            <button
                                className="flex items-center gap-2 p-2 w-full text-left hover:bg-gray-100 rounded-md mt-4"
                                aria-label="Sell"
                                onClick={handleSellButtonClick}
                            >
                                <img
                                    src={sellButtonImage}
                                    alt="Sell"
                                    className="h-8 w-auto object-contain"
                                />
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
}

export default Navbar;
