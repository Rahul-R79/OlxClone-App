import { useState } from 'react';
import bannerImg from '../../assets/images/Selling-Cars.jpg';
import toyotoImg from '../../assets/images/productsImg/toyoto.jpg';
import teslaImg from '../../assets/images/productsImg/Tesla_Model.jpg';
import fordImg from '../../assets/images/productsImg/ford.avif';
import bmwImg from '../../assets/images/productsImg/bmw.avif';
import iphoneImg from '../../assets/images/productsImg/iphone.jpg';
import samsungImg from '../../assets/images/productsImg/samsung-tv.avif';
import sonyImg from '../../assets/images/productsImg/sony.avif';
import mackbookImg from '../../assets/images/productsImg/mackbook.jpeg';
import villaImg from '../../assets/images/productsImg/villa.jpeg';
import downtownImg from '../../assets/images/productsImg/downtown.jpeg';
import cottageImg from '../../assets/images/productsImg/cottage.jpg';
import beachpropImg from '../../assets/images/productsImg/beach-prop.webp';
import porsheImg from '../../assets/images/productsImg/porshe.avif';
import rangeroverImg from '../../assets/images/productsImg/rover.avif';
import mercedesImg from '../../assets/images/productsImg/mercedes.avif';
import ProductDetails from '../ProductDetails/ProductDetails';
import './Home.css';

function Home() {
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Product data grouped by category
    const productsByCategory = [
    {
        category: "Cars",
        products: [
            {
                id: 1,
                name: "Toyota Camry 2023",
                price: 2073417,
                image: toyotoImg,
                description: "Reliable midsize sedan with great fuel economy..."
            },
            {
                id: 2,
                name: "Tesla Model 3",
                price: 3568997,
                image: teslaImg,
                description: "Electric vehicle with autopilot features..."
            },
            {
                id: 3,
                name: "Ford F-150",
                price: 3238617,
                image: fordImg,
                description: "Best-selling pickup truck in America..."
            },
            {
                id: 4,
                name: "BMW X5",
                price: 5145997,
                image: bmwImg,
                description: "Luxury SUV with premium features..."
            }
        ]
    },
    {
        category: "Electronics",
        products: [
            {
                id: 5,
                name: "iPhone 15 Pro",
                price: 82917,
                image: iphoneImg,
                description: "Latest Apple smartphone with A17 Pro chip..."
            },
            {
                id: 6,
                name: "Samsung QLED TV",
                price: 124417,
                image: samsungImg,
                description: "65-inch 4K Smart TV with Quantum Dot technology..."
            },
            {
                id: 7,
                name: "Sony WH-1000XM5",
                price: 33117,
                image: sonyImg,
                description: "Industry-leading noise-cancelling headphones..."
            },
            {
                id: 8,
                name: "MacBook Pro 14",
                price: 165917,
                image: mackbookImg,
                description: "Powerful laptop with M2 Pro chip..."
            }
        ]
    },
    {
        category: "Homes",
        products: [
            {
                id: 9,
                name: "Modern Villa",
                price: 62250000,
                image: villaImg,
                description: "4-bedroom villa with pool and ocean view..."
            },
            {
                id: 10,
                name: "Downtown Condo",
                price: 37350000,
                image: downtownImg,
                description: "2-bedroom luxury condo in city center..."
            },
            {
                id: 11,
                name: "Countryside Cottage",
                price: 26560000,
                image: cottageImg,
                description: "Charming 3-bedroom cottage with garden..."
            },
            {
                id: 12,
                name: "Beachfront Property",
                price: 99600000,
                image: beachpropImg,
                description: "Luxury beach house with private access..."
            }
        ]
    },
    {
        category: "Luxury Vehicles",
        products: [
            {
                id: 13,
                name: "Porsche 911",
                price: 9545000,
                image: porsheImg,
                description: "Iconic sports car with 379 horsepower..."
            },
            {
                id: 14,
                name: "Range Rover Autobiography",
                price: 12035000,
                image: rangeroverImg,
                description: "Ultra-luxury SUV with premium finishes..."
            },
            {
                id: 15,
                name: "Mercedes S-Class",
                price: 9794000,
                image: mercedesImg,
                description: "Flagship luxury sedan with cutting-edge tech..."
            }
        ]
    }
	];

    // Convert price to INR format
    const formatPrice = (price) => {
        return `₹${price.toLocaleString()}`;
    };

    // Handle showing product details
    const handleViewDetails = (product) => {
        setSelectedProduct(product);
    };

    // Handle closing product details
    const handleCloseDetails = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="home-container">
            {/* Top banner */}
            <img
                src={bannerImg}
                alt="banner"
                className="w-full h-[300px] sm:h-[450px] object-contain mt-8 sm:mt-0 mb-0 sm:mb-8"
            />

            {/* Loop through product categories and display each */}
            <div className="px-4 md:px-8 lg:px-12">
                {productsByCategory.map((categoryGroup) => (
                    <div key={categoryGroup.category} className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2">
                            {categoryGroup.category}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryGroup.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => handleViewDetails(product)}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-teal-600">
                                                {formatPrice(product.price)}
                                            </span>
                                            <button className="bg-teal-400 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Render product details modal if a product is selected */}
            {selectedProduct && (
                <ProductDetails
                    product={selectedProduct}
                    onClose={handleCloseDetails}
                />
            )}
        </div>
    );
}

export default Home;
