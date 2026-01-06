import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryDashboard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({
        itemName: '', quantity: 0, unit: 'pcs', lowStockThreshold: 10, category: 'General'
    });

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/inventory', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/inventory', newItem, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchInventory();
            setShowAddModal(false);
            setNewItem({ itemName: '', quantity: 0, unit: 'pcs', lowStockThreshold: 10, category: 'General' });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add item');
        }
    };

    const handleUpdateQuantity = async (id, newQuantity) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/inventory/${id}`,
                { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchInventory();
        } catch (err) {
            alert('Failed to update quantity');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/inventory/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchInventory();
        } catch (err) {
            alert('Failed to delete item');
        }
    };

    if (loading) return <div>Loading Inventory...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Inventory Management</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                >
                    + Add New Item
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <thead style={{ background: '#f5f5f5' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Item Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Quantity</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Unit</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem' }}>{item.itemName}</td>
                                <td style={{ padding: '1rem' }}>{item.category}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button onClick={() => handleUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}>+</button>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>{item.unit}</td>
                                <td style={{ padding: '1rem' }}>
                                    {item.quantity <= item.lowStockThreshold ? (
                                        <span style={{ color: 'red', fontWeight: 'bold' }}>Low Stock ⚠️</span>
                                    ) : (
                                        <span style={{ color: 'green' }}>Good</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                        <h2>Add Inventory Item</h2>
                        <form onSubmit={handleAddItem}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    required
                                    style={{ width: '100%', padding: '0.5rem' }}
                                    value={newItem.itemName}
                                    onChange={e => setNewItem({ ...newItem, itemName: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Category</label>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: '0.5rem' }}
                                    value={newItem.category}
                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        style={{ width: '100%', padding: '0.5rem' }}
                                        value={newItem.quantity}
                                        onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Unit</label>
                                    <select
                                        style={{ width: '100%', padding: '0.5rem' }}
                                        value={newItem.unit}
                                        onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                    >
                                        <option value="pcs">pcs</option>
                                        <option value="kg">kg</option>
                                        <option value="g">g</option>
                                        <option value="l">l</option>
                                        <option value="ml">ml</option>
                                        <option value="packs">packs</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Low Stock Threshold</label>
                                <input
                                    type="number"
                                    required
                                    style={{ width: '100%', padding: '0.5rem' }}
                                    value={newItem.lowStockThreshold}
                                    onChange={e => setNewItem({ ...newItem, lowStockThreshold: Number(e.target.value) })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add</button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ flex: 1, background: '#ccc' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDashboard;
