import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Check, X, Truck } from 'lucide-react';

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await api.getOrders(token);
                // Ensure we handle both { orders: [] } and [] formats
                setOrders(response.orders || response || []);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const markDelivered = async (id) => {
        if (!window.confirm("Mark this order as delivered?")) return;
        try {
            const token = localStorage.getItem('token');
            await api.updateOrderToDelivered(id, token);
            fetchOrders(); // Refresh data
        } catch (error) {
            alert(error.message);
        }
    };

    // Optional: Manual Mark as Paid (for Cash on Delivery handling)
    const markPaid = async (id) => {
        if (!window.confirm("Mark this order as paid?")) return;
        try {
            const token = localStorage.getItem('token');
            await api.updateOrderToPaid(id, token);
            fetchOrders();
        } catch (error) {
            alert(error.message);
        }
    }

    if (loading) return <div className="spinner"></div>;

    return (
        <div style={{ color: 'var(--text-main)', padding: '20px' }}>
            <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '20px' }}>Order Management</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>User</th>
                            <th style={{ padding: '15px' }}>Date</th>
                            <th style={{ padding: '15px' }}>Total</th>
                            <th style={{ padding: '15px' }}>Paid</th>
                            <th style={{ padding: '15px' }}>Delivered</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '15px', fontFamily: 'monospace' }}>{order._id.slice(-6)}</td>
                                <td style={{ padding: '15px' }}>{order.user?.name || 'Guest'}</td>
                                <td style={{ padding: '15px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '15px' }}>${order.totalPrice.toFixed(2)}</td>
                                <td style={{ padding: '15px' }}>
                                    {order.isPaid ?
                                        <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '5px' }}><Check size={16} /> {new Date(order.paidAt).toLocaleDateString()}</span> :
                                        <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '5px' }}><X size={16} /> Pending</span>
                                    }
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {order.isDelivered ?
                                        <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '5px' }}><Check size={16} /> Delivered</span> :
                                        <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '5px' }}><Truck size={16} /> Processing</span>
                                    }
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {!order.isDelivered && (
                                        <button
                                            onClick={() => markDelivered(order._id)}
                                            className="btn btn-primary"
                                            style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                    {/* Enable if manual payment marking is needed */}
                                    {!order.isPaid && (
                                        <button
                                            onClick={() => markPaid(order._id)}
                                            className="btn btn-secondary"
                                            style={{ padding: '5px 10px', fontSize: '0.8rem', marginLeft: '5px' }}
                                        >
                                            Mark Paid
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
