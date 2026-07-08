# AK Enjoy Falooda - Backend API (Python & Flask)

This is a complete, production-grade Python Flask REST API designed to power the **AK Enjoy Falooda** React application. It connects with SQL-based databases (both PostgreSQL and SQLite are fully supported) to store, fetch, update, and manage orders, menu items, registered customers, delivery boys, and staff members.

---

## 📂 Backend Structure
```text
backend/
├── app.py              # Main Flask server with REST API routes
├── schema.sql          # Standard SQL commands to create database tables and indexes
├── requirements.txt    # Required python packages
└── README.md           # Instructions and documentation (This file)
```

---

## 🛠️ Database Schema Tables

The tables defined in `schema.sql` are mapped to store the state of the React application:

1. **`menu_items`**: Houses the dessert menu, prices, tags, categories, and stock flags.
2. **`orders`**: Header table tracking overall order details (date, address, balance, delivery rider info, coordinates, and live progress state).
3. **`order_items`**: Mapped table for individual items purchased inside each order (Foreign Key linked with Cascade delete).
4. **`app_users`**: Registered customer catalog with lifetime order counts and last-seen activity metrics.
5. **`delivery_boys`**: Rider pool details (vehicle type, active flags) for order allocation.
6. **`staff_members`**: Kitchen and operational staff rosters (shifts, on-duty status).

---

## 🚀 How to Run locally

### 1. Prerequisite
Ensure you have **Python 3.8+** installed on your system.

### 2. Install Dependencies
Open a terminal in the `/backend` directory and run:
```bash
pip install -r requirements.txt
```

### 3. Database Configurations (Optional)
By default, **if no database connection string is specified, the application automatically runs on local file-based SQLite database (`database.db`)**. No setup is required for this!

To connect a robust **PostgreSQL** cloud or local instance, configure the `DATABASE_URL` environment variable:
```bash
export DATABASE_URL="postgresql://username:password@localhost:5432/falooda_db"
```

### 4. Run the Server
Launch the backend server:
```bash
python app.py
```
The server will boot on **http://localhost:5000** and will automatically run `schema.sql` to initialize your database tables on first launch.

---

## 🔌 API Documentation Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/health` | Live system check & DB source information |
| **GET** | `/api/menu` | Retrieves all dessert products |
| **POST** | `/api/menu` | Adds new item to menu card |
| **GET** | `/api/orders` | Retrieves all active and past orders |
| **POST** | `/api/orders` | Submits a new customer purchase order |
| **PUT** | `/api/orders/<id>/status` | Updates order stage (e.g., Preparing, Delivered) |
| **PUT** | `/api/orders/<id>/estimated-time` | Sets estimated delivery time string |
| **PUT** | `/api/orders/<id>/assign-delivery` | Assigns rider ID and changes status to Out for Delivery |
| **DELETE** | `/api/orders/<id>` | Deletes or cancels an existing order |
| **GET** | `/api/customers` | Retrieves registered customer metrics list |
| **POST** | `/api/customers` | Adds or updates customer statistics |
| **GET** | `/api/delivery-boys` | Retrieves rider profiles |
| **GET** | `/api/staff` | Retrieves staff directory |

---

## 🔗 Connecting with your React Frontend

To swap the React client-side states with this Flask REST API backend, update your data actions inside `src/App.tsx` (or other API proxy functions) to fetch from the live URL:

```typescript
const BACKEND_URL = "http://localhost:5000/api";

// Example: Fetching Menu Items
useEffect(() => {
  fetch(`${BACKEND_URL}/menu`)
    .then(res => res.json())
    .then(data => setMenuItems(data))
    .catch(err => console.error("API error", err));
}, []);

// Example: Placing an Order
const placeNewOrder = async (orderData) => {
  const response = await fetch(`${BACKEND_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return await response.json();
};
```
