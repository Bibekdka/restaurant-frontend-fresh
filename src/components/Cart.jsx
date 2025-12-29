import React from 'react';
import { api } from '../lib/api';

export default function Cart({ cart, onRemove, onClear }) {

    const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const taxPrice = itemsPrice * 0.15;
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const placeOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const orderData = {
                orderItems: cart,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paymentMethod: 'PayPal', // Dummy default
                shippingAddress: { // Dummy default
                    address: '123 Main St',
                    city: 'City',
                    postalCode: '12345',
                    country: 'Country'
                }
            };

            await api.createOrder(orderData, token);
            alert('Order Placed Successfully!');
            onClear();
        } catch (error) {
            alert('Error placing order: ' + error.message);
        }
    };

    return (
        <div style={{ color: 'var(--text-main)', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '20px' }}>Your Cart</h2>

            {cart.length === 0 ? (
                <p>Cart is empty</p>
            ) : (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                        {cart.map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--glass)', padding: '15px', borderRadius: '8px' }}>
                                <span>{item.name} (x{item.qty})</span>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span>${(item.price * item.qty).toFixed(2)}</span>
                                    <button onClick={() => onRemove(item.product)} style={{ background: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>X</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: 'var(--glass)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span>Subtotal</span>
                            <span>${itemsPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span>Tax</span>
                            <span>${taxPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span>Shipping</span>
                            <span>${shippingPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={placeOrder}
                            style={{
                                width: '100%', padding: '15px', background: 'var(--primary)',
                                color: 'white', border: 'none', borderRadius: '8px',
                                fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            Place Order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
