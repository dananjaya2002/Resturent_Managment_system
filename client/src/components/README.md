# UI Components Documentation

This document describes the reusable UI components created for better user experience.

---

## LoadingSpinner

A customizable loading indicator component.

### Import

```jsx
import LoadingSpinner from "../components/LoadingSpinner";
```

### Props

| Prop | Type   | Default      | Description                                    |
| ---- | ------ | ------------ | ---------------------------------------------- |
| size | string | 'medium'     | Size of spinner: 'small', 'medium', or 'large' |
| text | string | 'Loading...' | Optional text below spinner                    |

### Usage Examples

```jsx
// Basic usage
<LoadingSpinner />

// Custom size and text
<LoadingSpinner size="large" text="Loading your orders..." />

// Small spinner without text
<LoadingSpinner size="small" text="" />

// Button with inline loading
<button className="btn btn-primary btn-loading">
  <span className="spinner-inline"></span>
  Processing...
</button>
```

### Styling

- Full page loading: Wrap in `.loading-container`
- Inline button spinner: Add `.btn-loading` class to button + `.spinner-inline` span

---

## ErrorMessage

Displays error, warning, info, or success messages with optional actions.

### Import

```jsx
import ErrorMessage from "../components/ErrorMessage";
```

### Props

| Prop      | Type     | Default                | Description                                    |
| --------- | -------- | ---------------------- | ---------------------------------------------- |
| message   | string   | 'Something went wrong' | The message text to display                    |
| type      | string   | 'error'                | Type: 'error', 'warning', 'info', or 'success' |
| onRetry   | function | null                   | Optional retry callback                        |
| onDismiss | function | null                   | Optional dismiss callback                      |

### Usage Examples

```jsx
// Error with retry
<ErrorMessage
  type="error"
  message="Failed to load menu items"
  onRetry={fetchMenuItems}
/>

// Warning
<ErrorMessage
  type="warning"
  message="Some items in your cart are no longer available"
/>

// Success message
<ErrorMessage
  type="success"
  message="Order placed successfully!"
/>

// Info with dismiss
<ErrorMessage
  type="info"
  message="Your session will expire in 5 minutes"
  onDismiss={() => setShowInfo(false)}
/>
```

### Type Icons

- **error**: ❌ (Red background)
- **warning**: ⚠️ (Yellow background)
- **info**: ℹ️ (Blue background)
- **success**: ✅ (Green background)

---

## EmptyState

Displays a friendly message when there's no content to show.

### Import

```jsx
import EmptyState from "../components/EmptyState";
```

### Props

| Prop        | Type     | Default          | Description                |
| ----------- | -------- | ---------------- | -------------------------- |
| icon        | string   | '📭'             | Emoji or icon to display   |
| title       | string   | 'No items found' | Main heading               |
| description | string   | ''               | Optional description text  |
| actionText  | string   | null             | Call-to-action button text |
| onAction    | function | null             | CTA button click handler   |

### Usage Examples

```jsx
// Empty cart
<EmptyState
  icon="🛒"
  title="Your cart is empty"
  description="Add some delicious items from our menu to get started!"
  actionText="Browse Menu"
  onAction={() => navigate('/menu')}
/>

// No orders
<EmptyState
  icon="📦"
  title="No orders yet"
  description="Place your first order and track it here"
  actionText="Order Now"
  onAction={() => navigate('/menu')}
/>

// No search results
<EmptyState
  icon="🔍"
  title="No results found"
  description="Try adjusting your search terms"
/>

// No notifications
<EmptyState
  icon="🔔"
  title="All caught up!"
  description="You have no new notifications"
/>
```

---

## Common Patterns

### Loading State Pattern

```jsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [data, setData] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/data");
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

// In render
if (loading) return <LoadingSpinner text="Loading data..." />;
if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
if (data.length === 0) return <EmptyState title="No data available" />;

return <div>{/* render data */}</div>;
```

### Form Validation Pattern

```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!email) newErrors.email = "Email is required";
  if (!password) newErrors.password = "Password is required";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// In render
{
  errors.email && <ErrorMessage type="error" message={errors.email} />;
}
```

### Success Message Pattern

```jsx
const [success, setSuccess] = useState(false);

const handleSubmit = async () => {
  try {
    await api.post("/endpoint", data);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000); // Auto-dismiss after 3s
  } catch (err) {
    // handle error
  }
};

// In render
{
  success && (
    <ErrorMessage
      type="success"
      message="Saved successfully!"
      onDismiss={() => setSuccess(false)}
    />
  );
}
```

---

## Responsive Design Classes

The following utility classes are available globally:

### Layout

- `.container` - Max-width container with responsive padding
- `.grid` - Responsive grid (1 col mobile, 2 col tablet, 3+ col desktop)
- `.button-group` - Flex container for buttons (column on mobile, row on desktop)

### Text Alignment

- `.text-center`
- `.text-left`
- `.text-right`

### Spacing

- `.mt-1` to `.mt-4` - Margin top (0.5rem to 2rem)
- `.mb-1` to `.mb-4` - Margin bottom (0.5rem to 2rem)
- `.gap-1` to `.gap-3` - Gap for flex/grid (0.5rem to 1.5rem)

### Flexbox

- `.flex` - Display flex
- `.flex-col` - Flex direction column
- `.items-center` - Align items center
- `.justify-center` - Justify content center
- `.justify-between` - Justify content space-between

### Width

- `.w-full` - Width 100%

### Forms

- `.form-group` - Form field container
- `.form-label` - Form label
- `.form-input` - Styled input
- `.form-error` - Error message text
- `.form-help` - Help text

### Badges

- `.badge` - Base badge style
- `.badge-success` - Green badge
- `.badge-warning` - Yellow badge
- `.badge-error` - Red badge
- `.badge-info` - Blue badge
- `.badge-default` - Gray badge

---

## Accessibility Features

All components include:

- ✅ **Keyboard navigation** - Full tab support with visible focus states
- ✅ **Screen reader support** - Proper ARIA labels and semantic HTML
- ✅ **High contrast mode** - Works with Windows High Contrast
- ✅ **Reduced motion** - Respects `prefers-reduced-motion` setting
- ✅ **Touch targets** - Minimum 44x44px on mobile devices

### Using Skip Link

```jsx
// Add to top of App.jsx or layout
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// Add id to main content area
<main id="main-content">
  {/* page content */}
</main>
```

### Screen Reader Only Text

```jsx
<span className="sr-only">This text is only for screen readers</span>
```

---

## Testing Components

All components are designed to be easily testable:

```jsx
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

test("calls onRetry when retry button clicked", () => {
  const handleRetry = jest.fn();
  render(<ErrorMessage message="Error" onRetry={handleRetry} />);

  const retryButton = screen.getByText("Try Again");
  fireEvent.click(retryButton);

  expect(handleRetry).toHaveBeenCalledTimes(1);
});
```

---

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ iOS Safari 14+
✅ Android Chrome 90+

---

## Performance Tips

1. **Use LoadingSpinner for async operations > 500ms**

   - Don't show loading for very quick operations
   - Consider skeleton loaders for better UX

2. **Debounce error messages**

   - Avoid showing multiple errors rapidly
   - Auto-dismiss success messages after 3-5 seconds

3. **Lazy load EmptyState images**
   - Keep icons as emojis for better performance
   - Use SVG for custom illustrations

---

## Common Issues

### LoadingSpinner not centered

✅ **Solution**: Ensure parent has height set or use `.loading-large` class

### ErrorMessage too wide on mobile

✅ **Solution**: Already responsive, but check parent container width

### Focus outline not visible

✅ **Solution**: Don't use `outline: none` - use `:focus-visible` instead

### Animation too fast/slow

✅ **Solution**: Check if user has `prefers-reduced-motion` enabled

---

## Customization

To customize colors and styles, update CSS variables in `index.css`:

```css
:root {
  --primary-color: #ff5722;
  --error-color: #d63031;
  --success-color: #00b894;
  --text-primary: #2d3436;
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

## Questions?

For component usage questions or bug reports, please refer to:

- [PHASE_6_SUMMARY.md](../docs/PHASE_6_SUMMARY.md) - Full testing and implementation summary
- [SOCKET_IO_IMPLEMENTATION.md](../docs/SOCKET_IO_IMPLEMENTATION.md) - Real-time features guide
