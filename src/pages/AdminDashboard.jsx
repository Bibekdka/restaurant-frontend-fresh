import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import OrderList from '../components/OrderList';
import { DollarSign, ShoppingBag, Truck, Calendar } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await api.getDashboardStats(token);
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <div className="spinner"></div>;

    return (
        <div style={{ padding: '20px', color: 'var(--text-main)', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Admin Dashboard</h1>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={cardStyle}>
                    <div style={iconContainerStyle('#3b82f6')}><ShoppingBag color="white" /></div>
                    <div>
                        <div style={labelStyle}>Total Orders</div>
                        <div style={valueStyle}>{stats?.totalOrders || 0}</div>
                    </div>
                </div>
                <div style={cardStyle}>
                    <div style={iconContainerStyle('#10b981')}><Truck color="white" /></div>
                    <div>
                        <div style={labelStyle}>Delivered</div>
                        <div style={valueStyle}>{stats?.totalDelivered || 0}</div>
                    </div>
                </div>
                <div style={cardStyle}>
                    <div style={iconContainerStyle('#f59e0b')}><DollarSign color="white" /></div>
                    <div>
                        <div style={labelStyle}>Total Revenue</div>
                        <div style={valueStyle}>${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Date Stats */}
            <div style={{ marginBottom: '30px', background: 'var(--glass)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Last 7 Days Activity</h3>
                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {stats?.dateStats?.map(day => (
                        <div key={day._id} style={{ minWidth: '100px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{day._id}</div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '5px' }}>{day.count} Orders</div>
                            <div style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>${day.totalSales.toFixed(0)}</div>
                        </div>
                    ))}
                    {(!stats?.dateStats || stats.dateStats.length === 0) && <p>No recent activity.</p>}
                </div>
            </div>

            {/* Order Management */}
            <OrderList />
        </div>
    );
}

const cardStyle = {
    background: 'var(--glass)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
};

const iconContainerStyle = (color) => ({
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: color
});

const labelStyle = {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginBottom: '5px'
};

const valueStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--text-main)'
};
