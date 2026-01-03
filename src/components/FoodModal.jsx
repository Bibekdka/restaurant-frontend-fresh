import { useState } from "react";
import { X, Star, Send, ChevronLeft, ChevronRight, ShoppingCart, Trash2, CheckCircle } from "lucide-react";
import { api } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function FoodModal({ food, onClose, onAddToCart, isAdmin }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [reviewImage, setReviewImage] = useState("");
    const [isAdded, setIsAdded] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState(null); // { type: 'success'|'error', message }
    const [localReviews, setLocalReviews] = useState(food.reviews || []);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // reviewId pending

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            const data = await api.uploadImage(file);
            setReviewImage(data.image || data.url);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            setNotification({ type: 'error', message: 'Image upload failed' });
        }
    };

    // ... inside submitReview ...
    // update submitReview to use reviewImage

    // ... in JSX ...
    // replace submit button area

    // Support both old image field and new images array
    const images = food.images && food.images.length > 0
        ? food.images.map(img => typeof img === 'string' ? { url: img } : img)
        : food.image
            ? [{ url: food.image }]
            : [];

    const currentImage = images[currentImageIndex]?.url || '';

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleAddToCartClick = () => {
        if (onAddToCart) {
            onAddToCart(food);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        }
    };

    const submitReview = async () => {
        if (!comment.trim()) return;
        setSubmitting(true);

        try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const token = localStorage.getItem('token');
            const created = await api.addReview(food._id, {
                rating,
                comment,
                name: userData.name || 'Anonymous',
                user: userData._id || null,
                image: reviewImage
            }, token || "");

            // Update local reviews without reloading
            setLocalReviews(prev => [created, ...prev]);
            setComment("");
            setRating(5);
            setReviewImage("");
            setNotification({ type: 'success', message: 'Review submitted!' });
        } catch (e) {
            setNotification({ type: 'error', message: 'Error submitting review: ' + e.message });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = (reviewId) => {
        // show in-page confirm modal
        setShowDeleteConfirm(reviewId);
    };

    const confirmDeleteReview = async (reviewId) => {
        try {
            const token = localStorage.getItem('token');
            await api.deleteReview(food._id, reviewId, token);
            setLocalReviews(prev => prev.filter(r => r._id !== reviewId));
            setNotification({ type: 'success', message: 'Review deleted' });
        } catch (e) {
            setNotification({ type: 'error', message: 'Error deleting review: ' + e.message });
        } finally {
            setShowDeleteConfirm(null);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="modal-overlay"
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.6)'
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="modal-content"
                    onClick={e => e.stopPropagation()}
                    style={{
                        position: 'relative', width: '90%', maxWidth: '600px',
                        maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '0',
                        background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        margin: 'auto' /* Ensure centering behavior if flex fails */
                    }}
                >
                    <button onClick={onClose} style={{
                        position: 'absolute', top: 15, right: 15, zIndex: 10,
                        background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px',
                        padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)',
                        cursor: 'pointer', transition: 'background 0.2s', color: 'white'
                    }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,0,0,0.5)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        <X size={20} />
                    </button>

                    {/* Image Gallery */}
                    <div style={{ position: 'relative', height: '250px', background: '#000' }}>
                        <img src={currentImage} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    style={{
                                        position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white',
                                        borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    style={{
                                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white',
                                        borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <ChevronRight size={20} />
                                </button>
                                <div style={{
                                    position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
                                    background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px',
                                    borderRadius: '16px', fontSize: '0.85rem'
                                }}>
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </>
                        )}

                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'linear-gradient(to top, var(--bg-card), transparent)', padding: '20px', paddingTop: '60px'
                        }}>
                            <h2 style={{ fontSize: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', margin: 0 }}>{food.name}</h2>
                            <span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold' }}>${food.price}</span>
                        </div>
                    </div>

                    <div style={{ padding: '30px' }}>
                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--glass-border)',
                                    padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                <X size={20} /> Close
                            </button>
                            <button
                                onClick={handleAddToCartClick}
                                disabled={isAdded}
                                style={{
                                    flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    background: isAdded ? '#4CAF50' : 'var(--primary)',
                                    color: 'white', border: 'none',
                                    padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                            >
                                {isAdded ? (
                                    <>
                                        <CheckCircle size={20} /> Added to Cart!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} /> Add to Cart
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Description */}
                        {food.description && (
                            <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--glass)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: '1.6' }}>{food.description}</p>
                            </div>
                        )}

                        {/* Review Form */}
                        <div style={{ marginBottom: '30px', background: 'var(--glass)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Write a Review</h3>
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={28}
                                        fill={star <= rating ? "#FFD700" : "none"}
                                        color={star <= rating ? "#FFD700" : "#555"}
                                        onClick={() => setRating(star)}
                                        style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <textarea
                                        placeholder="Share your experience..."
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        style={{
                                            flex: 1, padding: '12px', minHeight: '60px',
                                            background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                                            borderRadius: '8px', color: 'var(--text-main)', resize: 'vertical', fontFamily: 'inherit'
                                        }}
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <label style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            width: '50px', height: '40px', borderRadius: '8px',
                                            background: 'var(--glass)', border: '1px solid var(--glass-border)', cursor: 'pointer'
                                        }}>
                                            <input type="file" onChange={uploadFileHandler} style={{ display: 'none' }} />
                                            <span style={{ fontSize: '1.2rem' }}>📷</span>
                                        </label>
                                        <button
                                            onClick={submitReview}
                                            disabled={submitting || !comment.trim()}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                width: '50px', height: '100%', borderRadius: '8px', padding: 0,
                                                background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', flex: 1
                                            }}
                                        >
                                            {submitting ? <div className="spinner">...</div> : <Send size={20} />}
                                        </button>
                                    </div>
                                </div>
                                {uploading && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploading image...</div>}
                                {reviewImage && (
                                    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                                        <img src={reviewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                        <button
                                            onClick={() => setReviewImage("")}
                                            style={{
                                                position: 'absolute', top: -5, right: -5, background: 'red', color: 'white',
                                                borderRadius: '50%', width: '16px', height: '16px', border: 'none',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px'
                                            }}
                                        >
                                            X
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="reviews-list">
                            <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '15px' }}>
                                Reviews <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'normal' }}>({food.reviews?.length || 0})</span>
                            </h3>

                            {(!localReviews || localReviews.length === 0) ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No reviews yet. Be the first!</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {(localReviews || []).slice().reverse().map((r, i) => (
                                        <motion.div
                                            key={r._id || i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="review-item"
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <div>
                                                    <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} fill={i < r.rating ? "#FFD700" : "none"} color={i < r.rating ? "#FFD700" : "#444"} />
                                                        ))}
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                                        {r.name || 'Anonymous'}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                                                    </span>
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => handleDeleteReview(r._id)}
                                                            style={{
                                                                background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: 0
                                                            }}
                                                            title="Delete Review"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {r.image && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <img src={r.image} alt="Review attachment" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                                </div>
                                            )}
                                            <p style={{ margin: 0, lineHeight: '1.5', color: '#ddd' }}>{r.comment}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                            {/* Confirm Delete Modal */}
                            {showDeleteConfirm && (
                                <div className="modal-overlay" style={{ zIndex: 1200 }}>
                                    <div className="modal-content" style={{ maxWidth: '420px', padding: '18px' }}>
                                        <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>
                                        <p>Are you sure you want to delete this review?</p>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                            <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                                            <button onClick={() => confirmDeleteReview(showDeleteConfirm)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: 'red', color: 'white', cursor: 'pointer' }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notification Toast */}
                            {notification && (
                                <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1300 }}>
                                    <div style={{ background: notification.type === 'error' ? '#fdd' : '#e6ffec', color: notification.type === 'error' ? '#900' : '#064', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}>
                                        {notification.message}
                                    </div>
                                </div>
                            )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
