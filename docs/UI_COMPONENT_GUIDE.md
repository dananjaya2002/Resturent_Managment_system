# UI Components Quick Reference Guide

## 🎨 Color Palette

```css
/* Primary Colors */
--primary-color: #FF6B35      /* Orange - Main brand color */
--accent-color: #00B894       /* Teal - Secondary actions */
--secondary-color: #2C3E50    /* Dark blue - Text */

/* Status Colors */
--success-color: #00B894      /* Green - Success states */
--error-color: #D63031        /* Red - Errors */
--warning-color: #FDCB6E      /* Yellow - Warnings */
--info-color: #74B9FF         /* Blue - Information */

/* Neutral Colors */
--background-color: #F8F9FA   /* Light gray - Page background */
--surface-color: #FFFFFF      /* White - Cards/surfaces */
--border-color: #E0E0E0       /* Gray - Borders */
--text-primary: #2C3E50       /* Dark - Main text */
--text-secondary: #636E72     /* Gray - Secondary text */
```

## 📦 Component Classes

### Buttons

```jsx
<button className="btn btn-primary">Primary Button</button>
<button className="btn">Secondary Button</button>
<button className="btn-dashboard-action">Dashboard Action</button>
<button className="filter-btn">Filter</button>
<button className="filter-btn active">Active Filter</button>
```

### Cards

```jsx
<div className="card">Basic Card</div>
<div className="dashboard-card">Dashboard Card</div>
<div className="stat-card">Stat Card</div>
<div className="table-card">Table Card</div>
<div className="employee-card">Employee Card</div>
```

### Badges

```jsx
<span className="modern-badge badge-success">Success</span>
<span className="modern-badge badge-warning">Warning</span>
<span className="modern-badge badge-error">Error</span>
<span className="modern-badge badge-info">Info</span>
<span className="status-badge status-pending">Pending</span>
```

### Tables

```jsx
<div className="modern-table-container">
  <table className="modern-table">
    <thead>
      <tr>
        <th>Header</th>
      </tr>
    </thead>
    <tbody>
      <tr className="table-row-hover">
        <td>Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Forms

```jsx
<form className="modern-form">
  <div className="form-group">
    <label className="form-label">
      <span className="label-icon">👤</span>
      Name
    </label>
    <input type="text" className="form-input" placeholder="Enter name" />
  </div>
</form>
```

### Loading States

```jsx
<div className="loading-container">
  <div className="spinner"></div>
  <p>Loading...</p>
</div>
```

### Empty States

```jsx
<div className="empty-state">
  <span className="empty-icon">📋</span>
  <p>No data found</p>
</div>
```

### Alerts

```jsx
<div className="alert alert-success">Success message</div>
<div className="alert alert-error">Error message</div>
<div className="alert alert-warning">Warning message</div>
<div className="alert alert-info">Info message</div>
```

## 🎯 Utility Classes

### Spacing

```css
.p-0, .p-1, .p-2, .p-3, .p-4  /* Padding */
.m-0, .m-1, .m-2, .m-3, .m-4  /* Margin */
.mx-auto; /* Center horizontally */
```

### Text

```css
.text-small,
.text-base,
.text-large,
.text-xl,
.text-2xl,
.text-3xl .font-light,
.font-normal,
.font-medium,
.font-semibold,
.font-bold .text-primary,
.text-secondary,
.text-success,
.text-error,
.text-warning .text-center,
.text-left,
.text-right .uppercase,
.lowercase,
.capitalize .text-truncate;
```

### Display

```css
.d-block,
.d-inline,
.d-inline-block,
.d-none .flex,
.flex-col .items-center,
.justify-center,
.justify-between .gap-1,
.gap-2,
.gap-3 .w-full,
.hidden;
```

### Styling

```css
.rounded,
.rounded-full .shadow-sm,
.shadow-md,
.shadow-lg;
```

### Grid

```css
.grid                /* Basic grid */
/* Basic grid */
.grid-2              /* 2 columns */
.grid-3              /* 3 columns */
.grid-4              /* 4 columns */
.grid-auto; /* Auto-fit responsive */
```

## 🎬 Animations

```css
.animate-fadeIn
  .animate-slideInUp
  .animate-slideInDown
  .animate-slideInLeft
  .animate-slideInRight
  .animate-scaleIn;
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) {
}

/* Desktop */
@media (min-width: 1025px) {
}
```

## 🎨 Dashboard Layout Structure

```jsx
<div className="dashboard-container">
  <div className="dashboard-header">
    <div className="header-content">
      <h1 className="dashboard-title">
        <span className="title-icon">🎯</span>
        Title
      </h1>
      <p className="dashboard-subtitle">Subtitle</p>
    </div>
    <div className="dashboard-actions">
      <button className="btn-dashboard-action">Action</button>
    </div>
  </div>

  <div className="dashboard-grid">
    <div className="dashboard-card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">📊</span>
          Card Title
        </h2>
        <span className="card-badge">Badge</span>
      </div>
      <!-- Card Content -->
    </div>
  </div>
</div>
```

## 📊 Stats Card Structure

```jsx
<div className="stats-grid">
  <div className="stat-card">
    <div className="stat-icon">🎯</div>
    <div className="stat-content">
      <p className="stat-label">Label</p>
      <p className="stat-value">100</p>
    </div>
  </div>
</div>
```

## 🔍 Search & Filter Pattern

```jsx
<div className="search-filter-section">
  <div className="search-box">
    <span className="search-icon">🔍</span>
    <input type="text" placeholder="Search..." className="search-input" />
  </div>
  <select className="role-filter">
    <option>Filter Option</option>
  </select>
</div>
```

## 🎯 Icon Reference

Common icons used throughout the app:

```
🍽️ - Restaurant/Food
👔 - Waiter
👨‍🍳 - Chef
💰 - Cashier/Money
📊 - Manager/Stats
👑 - Owner
📦 - Inventory/Orders
🪑 - Tables
👥 - Users/Customers
⚙️ - Settings/Admin
✅ - Success/Complete
⏳ - Pending/Waiting
🔒 - Locked/Occupied
🔍 - Search
📋 - Orders/List
🎯 - Target/Goal
🚚 - Delivery
```

## 💡 Best Practices

1. **Always use utility classes** for quick styling
2. **Maintain consistent spacing** (use 0.5rem increments)
3. **Use semantic HTML** (nav, main, section, article)
4. **Add hover effects** for interactive elements
5. **Include loading states** for async operations
6. **Show empty states** when no data
7. **Use icons** for better visual communication
8. **Test on mobile** devices regularly
9. **Follow color scheme** for consistency
10. **Add transitions** for smooth interactions

## 🚀 Quick Start Example

```jsx
import React from "react";

const MyComponent = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <span className="title-icon">🎯</span>
          My Dashboard
        </h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Items</p>
            <p className="stat-value">150</p>
          </div>
        </div>
      </div>

      <div className="modern-table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-row-hover">
              <td>Item 1</td>
              <td>
                <span className="modern-badge badge-success">Active</span>
              </td>
              <td>
                <button className="action-btn view">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyComponent;
```

## 📚 Resources

- Main styles: `client/src/index.css`
- Dashboard styles: `client/src/styles/dashboard.css`
- Enhanced styles: `client/src/styles/enhanced.css`
- Status badges: `client/src/styles/status-badges.css`
- Responsive: `client/src/responsive.css`

---

**Last Updated**: January 2026
**Version**: 2.0
