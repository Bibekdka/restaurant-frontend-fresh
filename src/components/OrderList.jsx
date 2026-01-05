import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Check, X, Truck, Clock, AlertCircle } from 'lucide-react';

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
        // Poll every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id, status) => {
        if (!window.confirm(`Mark order as ${status}?`)) return;
        try {
            const token = localStorage.getItem('token');
            await api.updateOrderStatus(id, status, token);
            fetchOrders();
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <div className="spinner"></div>;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'placed': return 'bg-yellow-500 text-black';
            case 'accepted': return 'bg-blue-500 text-white';
            case 'in kitchen': return 'bg-orange-500 text-white';
            case 'out for delivery': return 'bg-purple-500 text-white';
            case 'delivered': return 'bg-green-500 text-white';
            case 'rejected': return 'bg-red-500 text-white';
            case 'cancelled': return 'bg-red-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div style={{ color: 'var(--text-main)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', margin: 0 }}>Order Management</h2>
                <button onClick={fetchOrders} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text)', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>User</th>
                            <th style={{ padding: '15px' }}>Date</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Total</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '15px', fontFamily: 'monospace' }}>{order._id.slice(-6)}</td>
                                <td style={{ padding: '15px' }}>{order.user?.name || 'Guest'}</td>
                                <td style={{ padding: '15px' }}>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: "bold", textTransform: 'capitalize',
                                        backgroundColor: order.status === 'Placed' ? '#fbbf24' :
                                            order.status === 'Accepted' ? '#3b82f6' :
                                                order.status === 'In Kitchen' ? '#f59e0b' :
                                                    order.status === 'Out for Delivery' ? '#8b5cf6' :
                                                        order.status === 'Delivered' ? '#10b981' :
                                                            order.status === 'Rejected' ? '#ef4444' : '#6b7280',
                                        color: order.status === 'Placed' ? 'black' : 'white'
                                    }}>
                                        {order.status || (order.isDelivered ? 'Delivered' : 'Placed')}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>${order.totalPrice.toFixed(2)}</td>
                                <td style={{ padding: '15px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                    {(!order.status || order.status === 'Placed') && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(order._id, 'Accepted')}
                                                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => updateStatus(order._id, 'Rejected')}
                                                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {order.status === 'Accepted' && (
                                        <button
                                            onClick={() => updateStatus(order._id, 'In Kitchen')}
                                            style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            To Kitchen
                                        </button>
                                    )}
                                    {order.status === 'In Kitchen' && (
                                        <button
                                            onClick={() => updateStatus(order._id, 'Out for Delivery')}
                                            style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Deliver
                                        </button>
                                    )}
                                    {order.status === 'Out for Delivery' && (
                                        <button
                                            onClick={() => updateStatus(order._id, 'Delivered')}
                                            style={{ background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Complete
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
import { RefreshCw } from 'lucide-react';
