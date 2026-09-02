# 🛒 ShopCart – Shopping Cart Application

A responsive, feature-rich shopping cart application built as part of an internship assignment. Users can browse products, search and filter, manage their cart, and complete a multi-step checkout flow.

---

## 🚀 Live Demo

> Deploy link : https://cartshoppi.netlify.app/

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS v4 | Styling |
| pnpm | Package manager |
| Zustand | Global cart state management |
| TanStack Query v5 | API data fetching, caching & loading/error states |
| Zod | API response validation & shipping form validation |
| React Router DOM v7 | Client-side routing |
| localStorage (via Zustand persist) | Cart persistence across page refreshes |

---

## 📦 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- pnpm installed globally: `npm install -g pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/abhayprdp1/Shopping-Cart-Application.git

# Navigate to the project directory
cd Shopping-Cart-Application

# Install dependencies
pnpm install
```

### Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

---

## 🌐 API Used

**DummyJSON Products API**  
`https://dummyjson.com/products?limit=100`

- Free public REST API with 100+ products
- Returns product data including title, price, category, rating, images, stock, and more
- The API response is validated with **Zod** before being used in the application

---

## ✅ Features Completed

### Core Features
- **Product Listing** – Responsive product grid displaying 100 products with image, title, category, price, rating, and Add to Cart button
- **Loading State** – Skeleton card animations while data is fetching
- **API Error State** – Clear error message with a retry button
- **Empty State** – Friendly message when no products match the current filters
- **Search** – Search products by title and description in real time
- **Category Filter** – Filter products by category via dropdown
- **Price Filter** – Filter by min/max price range using dual sliders
- **Sort** – Sort by price (low→high, high→low), rating (top rated), name (A→Z)
- **Clear All Filters** – Single-click to reset all active filters
- **Cart Management** – Add, remove, increase/decrease quantity, clear cart
- **Quantity Limits** – Min quantity: 1, Max quantity: 5; buttons disabled at limits
- **Cart Item Count** – Displayed on the navbar cart icon as a badge
- **Cart Persistence** – Cart is saved in `localStorage` via Zustand persist middleware; survives page refresh
- **Cart Summary** – Subtotal, Tax (5%), Discount (10% when subtotal > $100), Final Total
- **Minimum Checkout** – Checkout disabled below $10 with a clear explanatory message
- **Checkout Flow** – Three-step: Cart Review → Shipping → Payment Summary
- **Step Validation** – Users cannot advance without completing the current step
- **Shipping Form** – Full name, email, phone, address, city, state, ZIP code, country; managed with React state (no form libraries)
- **Zod Validation** – Shipping form validated with Zod; inline error messages shown next to fields
- **Payment Summary** – Read-only review of shipping details, cart items, and full price breakdown
- **Order Placement** – Clicking "Place Order" clears cart and shows an animated success screen

### Bonus Features
- **Product Sorting** – Multiple sort options (price, rating, name)
- **Skeleton Loading** – Animated skeleton cards during API fetch
- **Dark Mode** – Full dark/light theme toggle (default: dark)
- **Product Details View** – Product detail modal on clicking product card

---

## 🏗️ Architecture Overview

### State Management
- **Zustand** (`cartStore.ts`) – manages cart items, add/remove/update/clear actions; persisted to `localStorage`
- **Zustand** (`themeStore.ts`) – manages dark/light theme toggle
- **TanStack Query** (`useProducts.ts`) – fetches and caches product data from DummyJSON API; handles loading and error states

### Custom Hooks
- `useProducts` – wraps TanStack Query for product fetching with Zod validation
- `useFilters` – manages search, category, price range, and sort state; returns filtered + sorted product list
- `useCartCalculations` – derives subtotal, discount, tax, total, and item count from cart state

### Zod Schemas
- `productSchema.ts` – validates the DummyJSON API response before usage
- `shippingSchema.ts` – validates all shipping form fields with appropriate rules
