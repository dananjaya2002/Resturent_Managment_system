# Role-Based Restaurant Management System - Testing Guide

This document outlines the new features and how to use the enhanced Restaurant Management System.

## Prerequisites: Seed Demo Users

**IMPORTANT**: Before testing, you need to create demo user accounts.

Run the following command in the `server` directory:
```bash
node src/seedUsers.js
```

This will create demo accounts with the following credentials:

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@resto.com        | admin123     |
| Owner    | owner@resto.com        | owner123     |
| Manager  | manager@resto.com      | manager123   |
| Chef     | chef@resto.com         | chef123      |

| Waiter   | waiter@resto.com       | waiter123    |
| Cashier  | cashier@resto.com      | cashier123   |
| Customer | customer@resto.com     | customer123  |

## 1. Role-Based Login
All users login via the standard `/login` page. The system automatically redirects them to their specialized dashboard based on their role:
- **Admin**: `/admin`
- **Waiter**: `/waiter`
- **Chef**: `/chef`
- **Cashier**: `/cashier`
- **Manager**: `/manager`
- **Owner**: `/owner`
- **Customer**: `/` (Home/Menu)

## 2. Waiter Module
### Table Allocation
- Waiters can view the status of all tables (Available, Occupied, Reserved).
- Waiters can manually update table status.

### Order Tracking
- Waiters can see a list of active orders.
- Waiters can mark orders as 'Delivered' when serving food.

## 3. Customer Module (Dine-in & Delivery)
### Menu & Cart
- Customers can browse the menu with images and filters.
- Add items to the cart.

### Checkout & Order Placement
- **Delivery**: Enter address details.
- **Dine-in**: Select "Dine-in" and enter the Table Number.
- Choose Payment Method (Cash, Card, Online).

### Order Tracking
- Real-time updates on order status (Preparing, Ready, etc.).

## 4. Chef Module (Kitchen Display System)
- **KDS**: Real-time view of incoming orders.
- Color-coded status (Pending = Orange, Prepared = Green).
- **Actions**:
    - **Start Preparing**: Moves order to 'preparing'.
    - **Mark Ready**: Notify waiter/customer that food is ready.

## 5. Cashier Module (POS)
### POS Interface
- Quick order creation for Walk-ins.
- Select Dine-in (Table) or Takeaway.
- Add items to cart and place order.

### Billing
- View all **Unpaid** orders.
- Mark orders as **Paid** to complete the transaction.

## 6. Inventory Module
- Accessible by Manager, Owner, Admin, Chef.
- **CRUD**: Add, Edit, Delete inventory items.
- **Low Stock Alerts**: Visual warning for items below threshold.

## 7. Manager & Owner Dashboards
### Manager
- **Stats Overview**: Revenue, Total Orders, Pending, Completed.
- Quick links to Inventory, Orders, and Admin sections.

### Owner
- **Includes Manager Stats**.
- **Employee Management**:
    - View all staff members.
    - **Create New Employee**: Register specific roles (Waiter, Chef, Cashier, etc.).
    - Delete employees.

---

## How to Test
1.  **Login as Owner**: Create accounts for Waiter, Chef, Cashier.
2.  **Login as Waiter/Customer**: Place an order (Dine-in Table 5).
3.  **Login as Chef**: See the order on Kitchen Display, mark as "Preparing", then "Ready".
4.  **Login as Waiter**: See order status change, mark as "Delivered".
5.  **Login as Cashier**: Go to "Billing", see the order, mark as "Paid".
6.  **Login as Manager**: Check the Dashboard for updated revenue and order counts.
