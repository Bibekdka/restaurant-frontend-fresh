import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const data = await api.getMyOrders(token);
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Loading orders...</div>;

    return (
        <div style={{ color: 'var(--text-main)', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '20px' }}>My Orders</h2>
            {orders.length === 0 ? (
                <p>No past orders found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {orders.slice().reverse().map(order => (
                        <div key={order._id} style={{ background: 'var(--glass)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold' }}>Order #{order._id.slice(-6)}</span>
                                <span style={{ color: 'var(--primary)' }}>${order.totalPrice.toFixed(2)}</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                            </div>
                            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
                                {order.orderItems.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                                        <span>{item.qty}x {item.name}</span>
                                        <span>${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
