import React from 'react';
import TableAllocation from './TableAllocation';
import OrderTrackingList from './OrderTrackingList';

const WaiterDashboard = () => {
    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1 className="page-title">Waiter Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <TableAllocation />
                </div>
                <div>
                    <OrderTrackingList />
                </div>
            </div>
        </div>
    );
};

export default WaiterDashboard;
