import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await api.getOrders(token);
                    setOrders(response.orders || []);
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
        <div style={{ color: 'var(--text-main)', padding: '20px' }}>
            <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '20px' }}>All Orders (Admin)</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th style={{ padding: '10px' }}>User</th>
                            <th style={{ padding: '10px' }}>Date</th>
                            <th style={{ padding: '10px' }}>Total</th>
                            <th style={{ padding: '10px' }}>Items</th>
                            <th style={{ padding: '10px' }}>Paid</th>
                            <th style={{ padding: '10px' }}>Delivered</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '10px' }}>{order._id.slice(-6)}</td>
                                <td style={{ padding: '10px' }}>{order.user?.name || 'Unknown'}</td>
                                <td style={{ padding: '10px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '10px' }}>${order.totalPrice.toFixed(2)}</td>
                                <td style={{ padding: '10px' }}>
                                    {order.orderItems.length} items
                                </td>
                                <td style={{ padding: '10px' }}>{order.isPaid ? 'Yes' : 'No'}</td>
                                <td style={{ padding: '10px' }}>{order.isDelivered ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
