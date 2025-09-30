# Basic Grid Example

This is a standalone example demonstrating the basic usage of `@teable/grid-table-kanban`.

## Features

- ✅ Basic grid with multiple cell types (Text, Number, Boolean, Rating, Select, Link)
- ✅ Column resizing
- ✅ Column freezing
- ✅ Row and column drag & drop
- ✅ Cell editing
- ✅ Add/remove rows and columns
- ✅ Scrollbars (horizontal and vertical)

## Running the Example

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at http://localhost:3001

## Key Configuration

### 1. CSS Imports (Required)

```tsx
import '@glideapps/glide-data-grid/dist/index.css'
```

This CSS file is **essential** for the Grid component to display scrollbars and other UI elements correctly.

### 2. Container Styling

```css
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#root {
  width: 100%;
  height: 100%;
}
```

The Grid component requires a parent with explicit dimensions to calculate scrollbar positions.

### 3. Grid Container

```tsx
<div className="flex-1 min-h-0 p-4">
  <div className="h-full bg-white rounded-lg shadow-lg border border-gray-200">
    <Grid
      style={{ width: '100%', height: '100%' }}
      // ... other props
    />
  </div>
</div>
```

Use flexbox with `flex-1 min-h-0` to ensure the Grid container gets proper height.

## Comparison with nextjs-app

This example follows the same patterns used in `apps/nextjs-app`:

1. Import `@glideapps/glide-data-grid/dist/index.css` before app styles
2. Use `overflow: hidden` on html/body
3. Ensure Grid parent has explicit height (via flexbox or absolute positioning)
4. Pass `style={{ width: '100%', height: '100%' }}` to Grid component