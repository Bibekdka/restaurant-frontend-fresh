import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const data = await api.getMyOrders(token);
                    // api.getMyOrders returns an object with `orders` key — normalize to array
                    setOrders(data.orders || data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleReorder = (order) => {
        if (!order || !order.orderItems) return;

        // Add all items to cart
        order.orderItems.forEach(item => {
            // We need to pass _id because cart expects food._id
            addToCart({ ...item, _id: item.product }, item.qty);
        });

        // Redirect to cart
        navigate('/cart');
    };

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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', display: 'block' }}>Order #{order._id.slice(-6)}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>

                                    {/* Status Badge */}
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                        backgroundColor:
                                            order.status === 'placed' ? '#fbbf24' : // Amber
                                                order.status === 'accepted' ? '#3b82f6' : // Blue
                                                    order.status === 'in kitchen' ? '#f59e0b' : // Orange
                                                        order.status === 'out for delivery' ? '#8b5cf6' : // Purple
                                                            order.status === 'delivered' ? '#10b981' : // Emerald
                                                                order.status === 'rejected' || order.status === 'cancelled' ? '#ef4444' : // Red
                                                                    '#6b7280', // Gray default
                                        color: '#fff',
                                        textTransform: 'capitalize'
                                    }}>
                                        {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                                    </span>

                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${order.totalPrice.toFixed(2)}</span>
                                    <button
                                        onClick={() => handleReorder(order)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            background: 'var(--primary)', color: 'white', border: 'none',
                                            borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '0.85rem'
                                        }}
                                    >
                                        <RefreshCw size={14} /> Reorder
                                    </button>
                                </div>
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
