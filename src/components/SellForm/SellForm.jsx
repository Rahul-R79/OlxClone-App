import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../context/AuthContext';
import closeIcon from '../../assets/images/close.svg';
import './SellForm.css';

function SellForm({ onClose }) {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        condition: 'used',
        images: []
    });

    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const categories = [
        'Electronics', 'Furniture', 'Cars', 'Bikes', 'Mobile Phones',
        'Books', 'Fashion', 'Pets', 'Services', 'Real Estate', 'Others'
    ];

    const conditions = [
        { value: 'new', label: 'New' },
        { value: 'used', label: 'Used - Like New' },
        { value: 'good', label: 'Used - Good' },
        { value: 'fair', label: 'Used - Fair' }
    ];

    const cloudinaryConfig = {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', {
                state: {
                    from: 'sell',
                    message: 'Please login to sell products',
                    redirectPath: window.location.pathname
                }
            });
            onClose();
        }
    }, [currentUser, navigate, onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + formData.images.length > 5) {
            setErrors(prev => ({ ...prev, images: 'You can upload maximum 5 images' }));
            return;
        }

        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, images: 'Only JPEG, PNG, and WebP images are allowed' }));
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, images: 'Image size should be less than 5MB' }));
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setErrors(prev => ({ ...prev, images: '' }));
        setFormData(prev => ({ ...prev, images: [...prev.images, ...validFiles] }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));

        if (formData.images.length > 1 && errors.images) {
            setErrors(prev => ({ ...prev, images: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Product title is required';
        else if (formData.title.length > 100) newErrors.title = 'Title should be less than 100 characters';

        if (!formData.price) newErrors.price = 'Price is required';
        else if (isNaN(formData.price) || parseFloat(formData.price) <= 0)
            newErrors.price = 'Please enter a valid positive number';
        else if (parseFloat(formData.price) < 1000)
            newErrors.price = 'Minimum price should be ₹1000';

        if (!formData.description.trim()) newErrors.description = 'Description is required';
        else if (formData.description.length > 1000) newErrors.description = 'Description should be less than 1000 characters';

        if (!formData.category) newErrors.category = 'Category is required';
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadImagesToCloudinary = async () => {
        const totalFiles = formData.images.length;
        let uploadedCount = 0;
        const uploadedUrls = [];

        for (const file of formData.images) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', cloudinaryConfig.uploadPreset);
                formData.append('cloud_name', cloudinaryConfig.cloudName);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error('Image upload failed');
                }

                const data = await response.json();
                uploadedUrls.push(data.secure_url);
                uploadedCount++;
                setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
            } catch (error) {
                console.error('Error uploading image:', error);
                throw error;
            }
        }

        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (!currentUser) {
            navigate('/login', { state: { from: 'sell', message: 'Please login to sell products' } });
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(0);

        try {
            const imageUrls = await uploadImagesToCloudinary();

            const productData = {
                title: formData.title.trim(),
                price: parseFloat(formData.price),
                description: formData.description.trim(),
                category: formData.category,
                condition: formData.condition,
                images: imageUrls,
                sellerId: currentUser.uid,
                sellerName: currentUser.displayName || 'Anonymous',
                sellerPhoto: currentUser.photoURL || null,
                createdAt: serverTimestamp(),
                status: 'available',
                views: 0,
                savedBy: []
            };

            await addDoc(collection(db, 'products'), productData);

            setFormData({
                title: '',
                price: '',
                description: '',
                category: '',
                condition: 'used',
                images: []
            });

            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                onClose();
            }, 3000);
        } catch (error) {
            console.error('Error submitting product:', error);
            alert('Failed to list product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className="sell-form-modal">
            <div className="sell-form-container">
                <button className="close-button" onClick={onClose}>
                    <img src={closeIcon} alt="Close" />
                </button>

                <h2>Sell Your Product</h2>

                <form onSubmit={handleSubmit}>
                    {/* TITLE */}
                    <div className="form-group">
                        <label htmlFor="title">Product Title*</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. iPhone 13 Pro Max 256GB"
                            maxLength={100}
                            className={errors.title ? 'error-input' : ''}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    {/* PRICE */}
                    <div className="form-group">
                        <label htmlFor="price">Price (₹)*</label>
                        <div className={`price-input-container ${errors.price ? 'error-input' : ''}`}>
                            <span className="currency-symbol">₹</span>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                                min="1000"
                            />
                        </div>
                        {errors.price && <span className="error-message">{errors.price}</span>}
                        {!errors.price && <span className="price-hint">Minimum price: ₹1000</span>}
                    </div>

                    {/* CATEGORY */}
                    <div className="form-group">
                        <label htmlFor="category">Category*</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={errors.category ? 'error-input' : ''}
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        {errors.category && <span className="error-message">{errors.category}</span>}
                    </div>

                    {/* CONDITION */}
                    <div className="form-group">
                        <label htmlFor="condition">Condition</label>
                        <div className="condition-options">
                            {conditions.map(cond => (
                                <label key={cond.value} className="condition-option">
                                    <input
                                        type="radio"
                                        name="condition"
                                        value={cond.value}
                                        checked={formData.condition === cond.value}
                                        onChange={handleChange}
                                    />
                                    <span>{cond.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="form-group">
                        <label htmlFor="description">Description*</label>
                        <textarea
                            name="description"
                            rows="5"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your product in detail..."
                            maxLength="1000"
                            className={errors.description ? 'error-input' : ''}
                        />
                        <div className="character-count">{formData.description.length}/1000 characters</div>
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    {/* IMAGES */}
                    <div className="form-group">
                        <label htmlFor="images">Upload Images* (Max 5)</label>
                        <div className="image-upload-container">
                            <input
                                type="file"
                                id="images"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/jpeg, image/png, image/webp"
                                multiple
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                className="upload-button"
                                onClick={() => fileInputRef.current.click()}
                                disabled={formData.images.length >= 5}
                            >
                                + Add Photos
                            </button>
                            <span className="image-requirements">JPEG, PNG, or WebP (Max 5MB each)</span>
                        </div>

                        <div className="image-preview-container">
                            {formData.images.map((image, index) => (
                                <div key={index} className="image-preview">
                                    <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                                    <button type="button" className="remove-image" onClick={() => removeImage(index)}>×</button>
                                </div>
                            ))}
                        </div>
                        {errors.images && <span className="error-message">{errors.images}</span>}
                    </div>

                    {/* SUBMIT */}
                    <div className="form-actions">
                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? `Uploading (${uploadProgress}%)` : 'Post Ad'}
                        </button>
                    </div>
                </form>
            </div>

            {showSuccessPopup && (
                <div className="success-popup">
                    <div className="success-content">
                        <h3>Product Added Successfully!</h3>
                        <p>Your product has been listed and is now visible to buyers.</p>
                        <div className="loading-bar"></div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellForm;
