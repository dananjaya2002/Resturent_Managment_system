import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

// Simple Settings Page Component
const Settings = () => {
    const { user, login } = useContext(AuthContext);
    // Note: Ideally we should probably have a 'refreshProfile' in context, 
    // but for now we can just use the token to make requests.

    // Use user data if available
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // Only send password if it's being updated
            const updateData = {
                name: formData.name,
                email: formData.email,
                ...(formData.password && { password: formData.password })
            };

            const res = await axios.put('http://localhost:5000/api/auth/profile', updateData, config);

            setMessage('Profile Updated Successfully');
            // Optimistically update or reload user? 
            // For now, simpler is better.
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="card">
                <h2 className="section-title">User Settings</h2>
                {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{error}</div>}
                {message && <div style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="form-control"
                            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="form-control"
                            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                        />
                    </div>

                    <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #eee' }} />
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Change Password (Optional)</h3>

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="form-control"
                            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                            placeholder="Leave blank to keep current"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="form-control"
                            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
