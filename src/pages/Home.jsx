import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '3.5rem', marginBottom: '20px', background: 'linear-gradient(to right, #FF4757, #FF6B81)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
                Welcome to Fine Dining
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px' }}
            >
                Experience the best culinary delights with our modern ordering system.
            </motion.p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <Link to="/menu" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem', textDecoration: 'none' }}>
                    Order Now
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '15px 40px', fontSize: '1.1rem', textDecoration: 'none' }}>
                    Login
                </Link>
            </div>

            <div className="grid" style={{ marginTop: '80px', textAlign: 'left' }}>
                <div className="glass-panel" style={{ padding: '30px' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🏃 Fast Delivery</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Get your food delivered fresh and hot within 30 minutes.</p>
                </div>
                <div className="glass-panel" style={{ padding: '30px' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>⭐ Top Rated</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Our dishes are prepared by world-class chefs.</p>
                </div>
                <div className="glass-panel" style={{ padding: '30px' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🔒 Secure Payment</h3>
                    <p style={{ color: 'var(--text-muted)' }}>100% secure payment processing for your peace of mind.</p>
                </div>
            </div>
        </div>
    );
}
