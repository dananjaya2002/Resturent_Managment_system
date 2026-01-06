import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrderTrackingList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            // Assuming we have an endpoint to get active orders
            // For now fetching all, but ideally should be filter by status NOT delivered
            const res = await axios.get('http://localhost:5000/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // simple client side filter for active orders
            const activeOrders = res.data.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');
            setOrders(activeOrders);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Polling for updates every 10 seconds for now (Socket.io will be better later)
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const markDelivered = async (id) => {
        try {
            const token = localStorage.getItem('token');
            // Assuming endpoint to update delivery status exists or using generic update
            // We might need to add a specific route for this or use the generic one if available
            // Let's assume PUT /api/orders/:id/deliver for now or generic update
            await axios.put(`http://localhost:5000/api/orders/${id}/status`,
                { status: 'delivered' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders();
        } catch (err) {
            alert('Failed to update order');
        }
    };

    if (loading) return <div>Loading Orders...</div>;

    return (
        <div className="order-tracking-list">
            <h3>Active Orders</h3>
            {orders.length === 0 ? <p>No active orders.</p> : (
                <div className="table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '0.5rem' }}>Order #</th>
                                <th style={{ padding: '0.5rem' }}>Status</th>
                                <th style={{ padding: '0.5rem' }}>Total</th>
                                <th style={{ padding: '0.5rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.5rem' }}>
                                        <Link to={`/orders/${order._id}`}>{order.orderNumber}</Link>
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <span className={`status-badge status-${order.orderStatus}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>${order.totalAmount}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        {order.orderStatus === 'ready' && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => markDelivered(order._id)}
                                            >
                                                Deliver
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderTrackingList;
