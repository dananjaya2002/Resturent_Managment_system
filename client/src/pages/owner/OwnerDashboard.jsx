import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagerDashboard from '../manager/ManagerDashboard'; // Reuse stats view

const OwnerDashboard = () => {
    const [view, setView] = useState('stats'); // 'stats' or 'employees'
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', role: 'staff' });

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter to show staff/managers/etc (exclude customers if needed, but let's show all for owner)
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (view === 'employees') {
            fetchEmployees();
        }
    }, [view]);

    const handleCreateEmployee = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', newEmployee);
            alert('Employee Created');
            setNewEmployee({ name: '', email: '', password: '', role: 'staff' });
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create employee');
        }
    };

    const handleDeleteEmployee = async (id) => {
        if (!confirm('Delete this user?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEmployees();
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Owner Dashboard</h1>
                <div>
                    <button
                        className={`btn ${view === 'stats' ? 'btn-primary' : ''}`}
                        onClick={() => setView('stats')}
                        style={{ marginRight: '1rem' }}
                    >
                        Overview
                    </button>
                    <button
                        className={`btn ${view === 'employees' ? 'btn-primary' : ''}`}
                        onClick={() => setView('employees')}
                    >
                        Employee Management
                    </button>
                </div>
            </div>

            {view === 'stats' ? (
                <ManagerDashboard />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    {/* Create Employee Form */}
                    <div className="card">
                        <h2>Add New Employee</h2>
                        <form onSubmit={handleCreateEmployee}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text" required
                                    value={newEmployee.name}
                                    onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email" required
                                    value={newEmployee.email}
                                    onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="text" required
                                    value={newEmployee.password}
                                    onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={newEmployee.role}
                                    onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                >
                                    <option value="waiter">Waiter</option>
                                    <option value="chef">Chef</option>
                                    <option value="cashier">Cashier</option>
                                    <option value="manager">Manager</option>
                                    <option value="delivery">Delivery</option>
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create User</button>
                        </form>
                    </div>

                    {/* Employee List */}
                    <div className="card">
                        <h2>Staff List</h2>
                        <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                                        <th style={{ padding: '0.5rem' }}>Name</th>
                                        <th style={{ padding: '0.5rem' }}>Role</th>
                                        <th style={{ padding: '0.5rem' }}>Email</th>
                                        <th style={{ padding: '0.5rem' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map(user => (
                                        <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem' }}>{user.name}</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <span className={`status-badge role-${user.role}`}>{user.role}</span>
                                            </td>
                                            <td style={{ padding: '0.5rem' }}>{user.email}</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleDeleteEmployee(user._id)}
                                                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
