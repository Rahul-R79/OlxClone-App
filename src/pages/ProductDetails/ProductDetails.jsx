import { FaHeart, FaShare, FaPhone, FaMapMarkerAlt, FaUser, FaShieldAlt } from 'react-icons/fa';
import { useEffect, useRef } from 'react';

function ProductDetails({ product, onClose }) {

    const modalRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" ref={modalRef}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                        <div className="flex gap-2">
                            <button className="text-gray-500 hover:text-gray-700">
                                <FaHeart className="text-xl" />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700">
                                <FaShare className="text-xl" />
                            </button>
                            <button 
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 text-2xl ml-2"
                            >
                                &times;
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/2">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-auto rounded-lg mb-4"
                            />

                            {/* Additional product images */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[1, 2, 3].map((num) => (
                                    <img 
                                        key={num}
                                        src={product.image} 
                                        alt={`${product.name} ${num}`}
                                        className="w-full h-24 object-cover rounded cursor-pointer"
                                    />
                                ))}
                            </div>

                            <div className="bg-gray-100 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">Description</h3>
                                <p className="text-gray-700">{product.description}</p>
                            </div>
                        </div>

                        <div className="md:w-1/2">
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-lg mb-2">Price</h3>
                                <p className="text-2xl font-bold text-blue-600">
                                    ₹{product.price.toLocaleString()}
                                </p>
                                {product.originalPrice && (
                                    <p className="text-gray-500 line-through">
                                        ₹{product.originalPrice.toLocaleString()}
                                    </p>
                                )}
                                {product.isNegotiable && (
                                    <p className="text-green-600 mt-1">Negotiable</p>
                                )}
                            </div>

                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-lg mb-2">Seller Information</h3>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <FaUser className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{product.sellerName || 'Private Seller'}</p>
                                        <p className="text-sm text-gray-600">Member since {product.memberSince || '2020'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 mt-2">
                                    <FaMapMarkerAlt />
                                    <span>{product.location || 'Delhi'}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors duration-300">
                                    <FaPhone /> Show Phone Number
                                </button>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors duration-300">
                                    Chat with Seller
                                </button>
                            </div>

                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                                <FaShieldAlt className="text-yellow-500 mt-1" />
                                <div>
                                    <p className="font-medium text-yellow-800">Safety Tips</p>
                                    <p className="text-sm text-yellow-700">
                                        Meet seller in a safe location. Check the item before you buy. Pay only after collecting the item.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Specifications */}
                    <div className="mt-6">
                        <h3 className="text-xl font-bold mb-3">Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Condition</p>
                                <p className="font-medium">{product.condition || 'Used'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Brand</p>
                                <p className="font-medium">{product.brand || 'Unknown'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Purchase Date</p>
                                <p className="font-medium">{product.purchaseDate || '2 years ago'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Warranty</p>
                                <p className="font-medium">{product.warranty || 'No'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Similar listings */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Similar Listings</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="border rounded-lg overflow-hidden cursor-pointer">
                                    <img 
                                        src={product.image} 
                                        alt={`Similar ${item}`}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="p-2">
                                        <p className="font-medium truncate">Similar {product.name}</p>
                                        <p className="text-blue-600 font-semibold">₹{(product.price - 1000).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
