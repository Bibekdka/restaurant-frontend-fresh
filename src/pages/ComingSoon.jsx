import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ComingSoon() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: 'var(--primary)' }}>Coming Soon</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '500px' }}>
                    We're currently cooking up something special for this page. Stay tuned!
                </p>
                <Link to="/" className="btn btn-primary">
                    Return Home
                </Link>
            </motion.div>
        </div>
    );
}
