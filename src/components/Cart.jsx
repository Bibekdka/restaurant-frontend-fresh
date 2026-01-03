import React, { useState } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Cart({ cart, onRemove, onClear }) {
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Form state
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

    const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const taxPrice = itemsPrice * 0.15;
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Validate address form
    const validateAddressForm = () => {
        if (!address || address.trim().length < 5) {
            setError("Address must be at least 5 characters");
            return false;
        }
        if (!city || city.trim().length < 2) {
            setError("City is required");
            return false;
        }
        if (!postalCode || postalCode.trim().length < 2) {
            setError("Postal code is required");
            return false;
        }
        if (!country || country.trim().length < 2) {
            setError("Country is required");
            return false;
        }
        return true;
    };

    const navigate = useNavigate();

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const placeOrder = async () => {
        setError("");

        if (!validateAddressForm()) {
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const orderData = {
                orderItems: cart.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image || (item.images?.[0]?.url) || '',
                    price: item.price,
                    product: item._id || item.product,
                })),
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paymentMethod,
                shippingAddress: {
                    address: address.trim(),
                    city: city.trim(),
                    postalCode: postalCode.trim(),
                    country: country.trim(),
                }
            };

            const created = await api.createOrder(orderData, token);
            setError("");
            onClear();
            setOrderId(created && created._id ? created._id : null);
            setShowConfirmation(true);
        } catch (error) {
            setError('Error placing order: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ color: 'var(--text-main)', padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '20px' }}>Your Cart</h2>

            {error && (
                <div style={{
                    padding: '12px',
                    backgroundColor: '#fee',
                    border: '1px solid #fcc',
                    borderRadius: '6px',
                    color: '#c33',
                    fontSize: '0.9rem',
                    marginBottom: '15px'
                }}>
                    {error}
                </div>
            )}

            {cart.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Your cart is empty</p>
            ) : (
                <>
                    <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                        {cart.map((item, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--glass)', padding: '15px', borderRadius: '8px', alignItems: 'center' }}
                            >
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: '500' }}>{item.name}</span>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Quantity: {item.qty}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '600' }}>${(item.price * item.qty).toFixed(2)}</span>
                                    <button 
                                        onClick={() => onRemove(item.product)} 
                                        style={{ background: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.9rem' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div style={{ background: 'var(--glass)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid var(--glass-border)' }}>
                            <span>Subtotal</span>
                            <span>${itemsPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid var(--glass-border)' }}>
                            <span>Tax (15%)</span>
                            <span>${taxPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '8px', borderBottom: '1px solid var(--glass-border)' }}>
                            <span>Shipping {itemsPrice > 100 ? '(Free)' : ''}</span>
                            <span>${shippingPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {!showAddressForm ? (
                        <button
                            onClick={() => setShowAddressForm(true)}
                            style={{
                                width: '100%', padding: '15px', background: 'var(--primary)',
                                color: 'white', border: 'none', borderRadius: '8px',
                                fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            Proceed to Checkout
                        </button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ background: 'var(--glass)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
                        >
                            <h3 style={{ marginBottom: '15px' }}>Shipping Address</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: 'var(--text-main)'
                                    }}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '6px',
                                            border: '1px solid var(--glass-border)',
                                            background: 'rgba(0,0,0,0.2)',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Postal Code"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '6px',
                                            border: '1px solid var(--glass-border)',
                                            background: 'rgba(0,0,0,0.2)',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: 'var(--text-main)'
                                    }}
                                />
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: 'var(--text-main)'
                                    }}
                                >
                                    <option value="Cash on Delivery">Cash on Delivery</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Debit Card">Debit Card</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button
                                    onClick={() => setShowAddressForm(false)}
                                    disabled={loading}
                                    style={{
                                        flex: 1, padding: '12px', background: 'transparent',
                                        color: 'var(--primary)', border: '1px solid var(--primary)',
                                        borderRadius: '6px', cursor: 'pointer', fontWeight: '500'
                                    }}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={placeOrder}
                                    disabled={loading}
                                    style={{
                                        flex: 1, padding: '12px', background: 'var(--primary)',
                                        color: 'white', border: 'none', borderRadius: '6px',
                                        cursor: 'pointer', fontWeight: '500'
                                    }}
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
}
