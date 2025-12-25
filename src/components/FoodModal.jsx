import { useState } from "react";
import { X, Star, Send } from "lucide-react";
import { api } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function FoodModal({ food, onClose }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submitReview = async () => {
        if (!comment.trim()) return;
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token'); // Might be null if guest
            await api.addReview(food.id, { rating, comment }, token || "");

            setComment("");
            alert("Review submitted!");
            window.location.reload(); // Refresh to show new rating
        } catch (e) {
            alert("Error submitting review: " + e.message);
        } finally {
            setSubmitting(false);
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
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
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
                        maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '0'
                    }}
                >
                    <button onClick={onClose} style={{
                        position: 'absolute', top: 15, right: 15, zIndex: 10,
                        background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '32px', height: '32px',
                        padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <X size={18} />
                    </button>

                    <div style={{ position: 'relative', height: '250px' }}>
                        <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'linear-gradient(to top, var(--bg-card), transparent)', padding: '20px', paddingTop: '60px'
                        }}>
                            <h2 style={{ fontSize: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{food.name}</h2>
                            <span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold' }}>${food.price}</span>
                        </div>
                    </div>

                    <div style={{ padding: '30px' }}>

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
                                <button
                                    onClick={submitReview}
                                    disabled={submitting || !comment.trim()}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '50px', height: 'auto', borderRadius: '8px', padding: 0
                                    }}
                                >
                                    {submitting ? <div className="spinner">...</div> : <Send size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="reviews-list">
                            <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '15px' }}>
                                Reviews <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'normal' }}>({food.reviews?.length || 0})</span>
                            </h3>

                            {(!food.reviews || food.reviews.length === 0) ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No reviews yet. Be the first to try it!</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {(food.reviews || []).slice().reverse().map((r, i) => (
                                        <motion.div
                                            key={r.id || i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="review-item"
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < r.rating ? "#FFD700" : "none"} color={i < r.rating ? "#FFD700" : "#444"} />
                                                    ))}
                                                </div>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                                                </span>
                                            </div>
                                            <p style={{ margin: 0, lineHeight: '1.5', color: '#ddd' }}>{r.comment}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
