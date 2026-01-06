import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableAllocation = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTables = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/tables', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTables(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch tables');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/tables/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTables(); // Refresh list
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div>Loading Tables...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="table-allocation">
            <h3>Table Management</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {tables.map(table => (
                    <div key={table._id} className="card" style={{
                        backgroundColor: table.status === 'occupied' ? '#fee2e2' : '#dcfce7',
                        border: '1px solid #ccc',
                        textAlign: 'center'
                    }}>
                        <h4>Table {table.tableNumber}</h4>
                        <p>Capacity: {table.capacity}</p>
                        <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{table.status}</p>
                        <div style={{ marginTop: '0.5rem' }}>
                            {table.status === 'available' && (
                                <button
                                    className="btn btn-primary"
                                    style={{ fontSize: '0.8rem', padding: '0.3rem' }}
                                    onClick={() => updateStatus(table._id, 'occupied')}
                                >
                                    Mark Occupied
                                </button>
                            )}
                            {table.status === 'occupied' && (
                                <button
                                    className="btn"
                                    style={{ fontSize: '0.8rem', padding: '0.3rem', backgroundColor: '#666', color: 'white' }}
                                    onClick={() => updateStatus(table._id, 'available')}
                                >
                                    Mark Available
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableAllocation;
