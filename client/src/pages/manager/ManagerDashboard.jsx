import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/orders/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading Stats...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Manager Dashboard</h1>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Total Revenue</h3>
                    <p style={{ fontSize: '2rem', color: '#4caf50', fontWeight: 'bold' }}>${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Total Orders</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalOrders}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Pending Orders</h3>
                    <p style={{ fontSize: '2rem', color: '#ff9800', fontWeight: 'bold' }}>{stats.pendingOrders}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Completed</h3>
                    <p style={{ fontSize: '2rem', color: '#2196f3', fontWeight: 'bold' }}>{stats.completedOrders}</p>
                </div>
            </div>

            {/* Quick Links */}
            <h2 style={{ marginBottom: '1rem' }}>Management Modules</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <Link to="/inventory" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', borderLeft: '5px solid #673ab7' }}>
                        <h3>Inventory Management</h3>
                        <p style={{ color: '#666' }}>Track stock, low stock items</p>
                    </div>
                </Link>
                <Link to="/admin" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', borderLeft: '5px solid #f44336' }}>
                        <h3>Menu & Users (Admin)</h3>
                        <p style={{ color: '#666' }}>Manage menu items and staff</p>
                    </div>
                </Link>
                <Link to="/orders" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', borderLeft: '5px solid #2196f3' }}>
                        <h3>All Orders</h3>
                        <p style={{ color: '#666' }}>View full order history</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ManagerDashboard;
