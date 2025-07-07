import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../context/UserProfileContext';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const MyAccount = () => {
    // Pull authenticated user
    const { currentUser } = useAuth();

    // Get user profile, products, and fetch handler from context
    const { userProfile, userProducts, loading, fetchUserProducts } = useUserProfile();

    // Local state for product edit and update
    const [editingProduct, setEditingProduct] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState({});

    // State for delete modal logic
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Trigger delete confirmation modal
    const handleDeleteClick = (productId) => {
        setProductToDelete(productId);
        setShowDeleteModal(true);
    };

    // Confirm and perform product deletion from Firestore
    const handleDeleteConfirm = async () => {
        try {
            await deleteDoc(doc(db, 'products', productToDelete));
            fetchUserProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    // Cancel deletion modal
    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    // Initiate editing mode for selected product
    const handleEdit = (product) => {
        setEditingProduct(product.id);
        setUpdatedProduct({
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category
        });
    };

    // Commit updated product data to Firestore
    const handleUpdate = async (productId) => {
        try {
            await updateDoc(doc(db, 'products', productId), updatedProduct);
            setEditingProduct(null);
            fetchUserProducts(); // Refresh UI
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    // Handle form input changes for editing product
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container mb-10 pt-44">
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                        <p className="mb-6">Are you sure you want to delete this product?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleDeleteCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Header */}
            <h1 className="text-2xl font-bold mb-6 ml-7">My Account</h1>

            <div className="bg-white rounded-lg shadow p-6">
                {/* User Info Section */}
                <div className="flex items-center gap-4 mb-6">
                    <img 
                        src={currentUser?.photoURL || '/default-user.png'} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{userProfile?.name || 'User'}</h2>
                        <p className="text-gray-600">{currentUser?.email}</p>
                    </div>
                </div>

                {/* Product List Section */}
                <h3 className="text-lg font-semibold mb-4">My Products</h3>

                {/* Handle loading or no product state */}
                {loading ? (
                    <p>Loading your products...</p>
                ) : userProducts.length === 0 ? (
                    <p>You haven't listed any products yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userProducts.map(product => (
                            <div key={product.id} className="border rounded-lg overflow-hidden relative">
                                {/* Editable state for product */}
                                {editingProduct === product.id ? (
                                    <div className="p-4">
                                        <input
                                            type="text"
                                            name="title"
                                            value={updatedProduct.title}
                                            onChange={handleChange}
                                            className="w-full p-2 mb-2 border rounded"
                                        />
                                        <input
                                            type="number"
                                            name="price"
                                            value={updatedProduct.price}
                                            onChange={handleChange}
                                            className="w-full p-2 mb-2 border rounded"
                                        />
                                        <textarea
                                            name="description"
                                            value={updatedProduct.description}
                                            onChange={handleChange}
                                            className="w-full p-2 mb-2 border rounded"
                                            rows="3"
                                        />
                                        <div className="flex justify-between">
                                            <button 
                                                onClick={() => handleUpdate(product.id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                onClick={() => setEditingProduct(null)}
                                                className="bg-gray-500 text-white px-3 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Product Preview Card */}
                                        <img 
                                            src={product.images[0]} 
                                            alt={product.title} 
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h4 className="font-semibold">{product.title}</h4>
                                            <p className="text-teal-600 font-bold">₹{product.price}</p>
                                            <p className="text-sm text-gray-500 capitalize">{product.status}</p>
                                        </div>

                                        {/* Edit & Delete Buttons */}
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button 
                                                onClick={() => handleEdit(product)}
                                                className="bg-blue-500 text-white p-1 rounded-full"
                                            >
                                                {/* Edit Icon */}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(product.id)}
                                                className="bg-red-500 text-white p-1 rounded-full"
                                            >
                                                {/* Delete Icon */}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAccount;
