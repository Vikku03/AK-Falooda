-- SQL Schema for AK Enjoy Falooda Database
-- Compatible with PostgreSQL and MySQL

-- 1. Create Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('falooda', 'icecream', 'beverages')),
    description TEXT,
    is_special BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    tags TEXT, -- Stored as comma-separated values or JSON string
    image TEXT,
    is_out_of_stock BOOLEAN DEFAULT FALSE
);

-- 2. Create Customers / App Users Table
CREATE TABLE IF NOT EXISTS app_users (
    phone VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    orders_count INTEGER DEFAULT 0,
    last_order_date VARCHAR(20)
);

-- 3. Create Admin Accounts Table
CREATE TABLE IF NOT EXISTS admin_accounts (
    phone VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_date VARCHAR(20) NOT NULL
);

-- 4. Create Delivery Boys Table
CREATE TABLE IF NOT EXISTS delivery_boys (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    vehicle VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Inactive'))
);

-- 5. Create Staff Members Table
CREATE TABLE IF NOT EXISTS staff_members (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL,
    shift VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('On Duty', 'Off Duty'))
);

-- 6. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g. INV-123456
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    subtotal DECIMAL(10, 2) NOT NULL,
    advance_paid DECIMAL(10, 2) NOT NULL,
    cod_balance DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled')),
    date VARCHAR(20) NOT NULL,
    time VARCHAR(20) NOT NULL,
    delivery_boy_id VARCHAR(50) REFERENCES delivery_boys(id) ON DELETE SET NULL,
    delivery_boy_name VARCHAR(100),
    estimated_delivery_time VARCHAR(50)
);

-- 7. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    customizations TEXT
);

-- INDEXES for high-performance lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);

-- SEED DATA (Optional initial setup data)
INSERT INTO menu_items (id, name, price, category, description, is_special, is_popular, tags, image, is_out_of_stock)
VALUES 
('M1', 'Royal Special Falooda', 180.00, 'falooda', 'Rich layers of sweet vermicelli, healthy sabja seeds, premium rose milk, fresh cream, dry fruits, and double scoops of Royal Vanilla and Kesar Pista ice cream.', true, true, 'Best Seller, Chef Special, Rich', 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=600&auto=format&fit=crop', false),
('M2', 'Classic Rose Falooda', 140.00, 'falooda', 'Traditional rose-infused milk beverage layered with basil seeds, vermicelli, topped with a scoop of premium vanilla ice cream and glazed cherries.', false, true, 'Traditional, Classic', 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=600&auto=format&fit=crop', false),
('M3', 'Kesar Pista Ice Cream', 90.00, 'icecream', 'Creamy, rich ice cream loaded with pure saffron flavor and crunchy premium pistachio slivers.', false, false, 'Premium, Nuts', 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=600&auto=format&fit=crop', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_boys (id, name, phone, vehicle, status)
VALUES
('DB1', 'Rajesh Kumar', '9988776655', 'Honda Activa', 'Active'),
('DB2', 'Amit Singh', '8877665544', 'Hero Splendor', 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO staff_members (id, name, phone, role, shift, status)
VALUES
('ST1', 'Chef Ravi Shankar', '9911223344', 'Head Chef', 'Morning (9 AM - 6 PM)', 'On Duty'),
('ST2', 'Suresh Patel', '9922334455', 'Kitchen Helper', 'Evening (4 PM - 11 PM)', 'On Duty')
ON CONFLICT (id) DO NOTHING;
