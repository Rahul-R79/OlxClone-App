const Footer = () => {
    return (
        <footer className="bg-gray-50 text-gray-800 py-10 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {/* Popular Categories */}
                <div className="space-y-3">
                    <h4 className="font-bold text-lg">POPULAR CATEGORIES</h4>
                    <ul className="space-y-2">
                        {['Cars', 'Flats for rent', 'Jobs', 'Mobile Phones'].map((item) => (
                            <li key={item} className="hover:text-blue-600 cursor-pointer">{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Trending Searches */}
                <div className="space-y-3">
                    <h4 className="font-bold text-lg">TRENDING SEARCHES</h4>
                    <ul className="space-y-2">
                        {['Bikes', 'Watches', 'Books', 'Dogs'].map((item) => (
                            <li key={item} className="hover:text-blue-600 cursor-pointer">{item}</li>
                        ))}
                    </ul>
                </div>

                {/* About Us */}
                <div className="space-y-3">
                    <h4 className="font-bold text-lg">ABOUT US</h4>
                    <ul className="space-y-2">
                        {['About OLX Group', 'OLX Blog', 'Contact Us', 'OLX for Businesses'].map((item) => (
                            <li key={item} className="hover:text-blue-600 cursor-pointer">{item}</li>
                        ))}
                    </ul>
                </div>

                {/* OLX */}
                <div className="space-y-3">
                    <h4 className="font-bold text-lg">OLX</h4>
                    <ul className="space-y-2">
                        {['Help', 'Sitemap', 'Terms of use', 'Privacy Policy'].map((item) => (
                            <li key={item} className="hover:text-blue-600 cursor-pointer">{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Follow Us & App Stores */}
                <div className="space-y-4">
                    <h4 className="font-bold text-sm">DOWNLOAD APP</h4>
                    <div className="flex space-x-2">
                        <div className="px-4 py-2 bg-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                            <span className="text-xs font-medium">Google Play</span>
                        </div>
                        <div className="px-4 py-2 bg-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                            <span className="text-xs font-medium">App Store</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-gray-300 text-center text-sm">
                <p>© 2024-2025 OLX-CLONE</p>
            </div>
        </footer>
    );
};

export default Footer;
