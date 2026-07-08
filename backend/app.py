# -*- coding: utf-8 -*-
"""
AK Enjoy Falooda - Python Flask API Backend
Provides full REST endpoints matching the TypeScript Frontend and stores data in a SQL Database.
Supports PostgreSQL (via psycopg2) or SQLite (as a simple file-based fallback).
"""

import os
import sqlite3
import json
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables (.env file)
load_dotenv()

app = Flask(__name__)
# Enable CORS so the React frontend can make requests to this backend
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Determine database connection string. If DATABASE_URL is not set, we use SQLite for painless local testing.
DATABASE_URL = os.getenv("DATABASE_URL")
SQLITE_DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

def get_db_connection():
    """
    Returns a database connection.
    If DATABASE_URL is configured, connects to PostgreSQL.
    Otherwise, defaults to SQLite.
    """
    if DATABASE_URL:
        import psycopg2
        from psycopg2.extras import RealDictCursor
        conn = psycopg2.connect(DATABASE_URL)
        # Return dict-like cursor for easy JSON conversion
        return conn, True
    else:
        conn = sqlite3.connect(SQLITE_DB_PATH)
        # Configure SQLite to return rows as dictionaries
        conn.row_factory = sqlite3.Row
        return conn, False

def init_db():
    """
    Initializes the database.
    Creates tables if they don't exist and seeds initial data.
    """
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()

    # Read the schema.sql file
    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    if os.path.exists(schema_path):
        with open(schema_path, "r") as f:
            schema_sql = f.read()
        
        if is_pg:
            # PostgreSQL execution
            cursor.execute(schema_sql)
        else:
            # SQLite execution (Note: we replace some PostgreSQL specific syntax like SERIAL or JSON checks)
            sqlite_schema = schema_sql.replace("SERIAL PRIMARY KEY", "INTEGER PRIMARY KEY AUTOINCREMENT")
            sqlite_schema = sqlite_schema.replace("CHECK (category IN ('falooda', 'icecream', 'beverages'))", "")
            sqlite_schema = sqlite_schema.replace("CHECK (status IN ('Active', 'Inactive'))", "")
            sqlite_schema = sqlite_schema.replace("CHECK (status IN ('On Duty', 'Off Duty'))", "")
            sqlite_schema = sqlite_schema.replace("CHECK (status IN ('Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'))", "")
            sqlite_schema = sqlite_schema.replace("DOUBLE PRECISION", "REAL")
            sqlite_schema = sqlite_schema.replace("ON CONFLICT (id) DO NOTHING", "")
            sqlite_schema = sqlite_schema.replace("ON CONFLICT (phone) DO NOTHING", "")
            
            # Execute scripts split by semicolon to handle multiple statements in standard sqlite3
            for statement in sqlite_schema.split(";"):
                stmt = statement.strip()
                if stmt:
                    try:
                        cursor.execute(stmt)
                    except Exception as e:
                        # Print statement errors but continue
                        print(f"SQLite Statement Error: {e}")
                        
            # Manual seed for SQLite since ON CONFLICT was stripped
            try:
                cursor.execute("SELECT COUNT(*) FROM menu_items")
                if cursor.fetchone()[0] == 0:
                    cursor.execute("""
                        INSERT INTO menu_items (id, name, price, category, description, is_special, is_popular, tags, image, is_out_of_stock)
                        VALUES ('M1', 'Royal Special Falooda', 180.00, 'falooda', 'Rich layers of sweet vermicelli, premium rose milk, fresh cream, dry fruits, and double scoops of Royal Vanilla and Kesar Pista ice cream.', 1, 1, 'Best Seller, Chef Special', 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=600&auto=format&fit=crop', 0)
                    """)
                    cursor.execute("""
                        INSERT INTO delivery_boys (id, name, phone, vehicle, status)
                        VALUES ('DB1', 'Rajesh Kumar', '9988776655', 'Honda Activa', 'Active')
                    """)
                    cursor.execute("""
                        INSERT INTO staff_members (id, name, phone, role, shift, status)
                        VALUES ('ST1', 'Chef Ravi Shankar', '9911223344', 'Head Chef', 'Morning', 'On Duty')
                    """)
            except Exception as e:
                print(f"SQLite seeding failed: {e}")
                
        conn.commit()
    conn.close()

# -----------------------------------------------------------------------------
# REST API Endpoints
# -----------------------------------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "PostgreSQL" if DATABASE_URL else "SQLite (Local File)"
    })

# --- MENU ENDPOINTS ---

@app.route("/api/menu", methods=["GET"])
def get_menu():
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM menu_items")
        rows = cursor.fetchall()
        
        menu_items = []
        for r in rows:
            # Map SQL row to TypeScript interface
            item = {
                "id": r["id"] if not is_pg else r[0],
                "name": r["name"] if not is_pg else r[1],
                "price": float(r["price"] if not is_pg else r[2]),
                "category": r["category"] if not is_pg else r[3],
                "description": r["description"] if not is_pg else r[4],
                "isSpecial": bool(r["is_special"] if not is_pg else r[5]),
                "isPopular": bool(r["is_popular"] if not is_pg else r[6]),
                "tags": (r["tags"].split(", ") if r["tags"] else []) if not is_pg else (r[7].split(", ") if r[7] else []),
                "image": r["image"] if not is_pg else r[8],
                "isOutOfStock": bool(r["is_out_of_stock"] if not is_pg else r[9])
            }
            menu_items.append(item)
            
        return jsonify(menu_items)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/api/menu", methods=["POST"])
def add_menu_item():
    data = request.json
    if not data or not data.get("id") or not data.get("name"):
        return jsonify({"error": "Missing required item fields (id, name)"}), 400
        
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        tags_str = ", ".join(data.get("tags", []))
        cursor.execute("""
            INSERT INTO menu_items (id, name, price, category, description, is_special, is_popular, tags, image, is_out_of_stock)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """ if is_pg else """
            INSERT INTO menu_items (id, name, price, category, description, is_special, is_popular, tags, image, is_out_of_stock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["id"],
            data["name"],
            data.get("price", 0.0),
            data.get("category", "falooda"),
            data.get("description", ""),
            1 if data.get("isSpecial") else 0,
            1 if data.get("isPopular") else 0,
            tags_str,
            data.get("image", ""),
            1 if data.get("isOutOfStock") else 0
        ))
        conn.commit()
        return jsonify({"success": True, "message": "Menu item added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# --- ORDER ENDPOINTS ---

@app.route("/api/orders", methods=["GET"])
def get_orders():
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        # Fetch orders
        cursor.execute("SELECT * FROM orders ORDER BY date DESC, time DESC")
        order_rows = cursor.fetchall()
        
        orders = []
        for r in order_rows:
            o_id = r["id"] if not is_pg else r[0]
            
            # Fetch corresponding items for this order
            cursor_items = conn.cursor()
            cursor_items.execute("""
                SELECT name, quantity, price, customizations 
                FROM order_items WHERE order_id = %s
            """ if is_pg else """
                SELECT name, quantity, price, customizations 
                FROM order_items WHERE order_id = ?
            """, (o_id,))
            item_rows = cursor_items.fetchall()
            
            items = []
            for ir in item_rows:
                items.append({
                    "name": ir["name"] if not is_pg else ir[0],
                    "quantity": ir["quantity"] if not is_pg else ir[1],
                    "price": float(ir["price"] if not is_pg else ir[2]),
                    "customizations": ir["customizations"] if not is_pg else ir[3]
                })
                
            # Build mapped Order dictionary
            order_data = {
                "id": o_id,
                "customerName": r["customer_name"] if not is_pg else r[1],
                "customerPhone": r["customer_phone"] if not is_pg else r[2],
                "customerAddress": r["customer_address"] if not is_pg else r[3],
                "latitude": r["latitude"] if not is_pg else r[4],
                "longitude": r["longitude"] if not is_pg else r[5],
                "items": items,
                "subtotal": float(r["subtotal"] if not is_pg else r[6]),
                "advancePaid": float(r["advance_paid"] if not is_pg else r[7]),
                "codBalance": float(r["cod_balance"] if not is_pg else r[8]),
                "status": r["status"] if not is_pg else r[9],
                "date": r["date"] if not is_pg else r[10],
                "time": r["time"] if not is_pg else r[11],
                "deliveryBoyId": r["delivery_boy_id"] if not is_pg else r[12],
                "deliveryBoyName": r["delivery_boy_name"] if not is_pg else r[13],
                "estimatedDeliveryTime": r["estimated_delivery_time"] if not is_pg else r[14]
            }
            orders.append(order_data)
            
        return jsonify(orders)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/api/orders", methods=["POST"])
def place_order():
    data = request.json
    if not data or not data.get("id") or not data.get("items"):
        return jsonify({"error": "Missing order details"}), 400
        
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        # 1. Insert order header
        cursor.execute("""
            INSERT INTO orders (
                id, customer_name, customer_phone, customer_address, 
                latitude, longitude, subtotal, advance_paid, cod_balance, 
                status, date, time, estimated_delivery_time
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """ if is_pg else """
            INSERT INTO orders (
                id, customer_name, customer_phone, customer_address, 
                latitude, longitude, subtotal, advance_paid, cod_balance, 
                status, date, time, estimated_delivery_time
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["id"],
            data["customerName"],
            data["customerPhone"],
            data["customerAddress"],
            data.get("latitude"),
            data.get("longitude"),
            data["subtotal"],
            data["advancePaid"],
            data["codBalance"],
            data.get("status", "Pending"),
            data["date"],
            data["time"],
            data.get("estimatedDeliveryTime", "35 mins")
        ))
        
        # 2. Insert order items
        for item in data["items"]:
            cursor.execute("""
                INSERT INTO order_items (order_id, name, quantity, price, customizations)
                VALUES (%s, %s, %s, %s, %s)
            """ if is_pg else """
                INSERT INTO order_items (order_id, name, quantity, price, customizations)
                VALUES (?, ?, ?, ?, ?)
            """, (
                data["id"],
                item["name"],
                item["quantity"],
                item["price"],
                item.get("customizations", "")
            ))
            
        # 3. Add or update registered customer stats
        clean_phone = data["customerPhone"].replace(" ", "").replace("-", "")
        cursor.execute("SELECT orders_count FROM app_users WHERE phone = %s" if is_pg else "SELECT orders_count FROM app_users WHERE phone = ?", (clean_phone,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            curr_count = existing_user[0] if is_pg else existing_user["orders_count"]
            cursor.execute("""
                UPDATE app_users 
                SET orders_count = %s, last_order_date = %s, name = %s, address = %s 
                WHERE phone = %s
            """ if is_pg else """
                UPDATE app_users 
                SET orders_count = ?, last_order_date = ?, name = ?, address = ? 
                WHERE phone = ?
            """, (curr_count + 1, data["date"], data["customerName"], data["customerAddress"], clean_phone))
        else:
            cursor.execute("""
                INSERT INTO app_users (phone, name, address, orders_count, last_order_date)
                VALUES (%s, %s, %s, %s, %s)
            """ if is_pg else """
                INSERT INTO app_users (phone, name, address, orders_count, last_order_date)
                VALUES (?, ?, ?, ?, ?)
            """, (clean_phone, data["customerName"], data["customerAddress"], 1, data["date"]))

        conn.commit()
        return jsonify({"success": True, "message": "Order registered", "orderId": data["id"]}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/api/orders/<order_id>/status", methods=["PUT"])
def update_order_status(order_id):
    data = request.json
    if not data or "status" not in data:
        return jsonify({"error": "Missing 'status' value"}), 400
        
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE orders SET status = %s WHERE id = %s
        """ if is_pg else """
            UPDATE orders SET status = ? WHERE id = ?
        """, (data["status"], order_id))
        conn.commit()
        return jsonify({"success": True, "message": f"Order status updated to {data['status']}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/api/orders/<order_id>/estimated-time", methods=["PUT"])
def update_order_estimated_time(order_id):
    data = request.json
    if not data or "estimatedDeliveryTime" not in data:
        return jsonify({"error": "Missing 'estimatedDeliveryTime' value"}), 400
        
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE orders SET estimated_delivery_time = %s WHERE id = %s
        """ if is_pg else """
            UPDATE orders SET estimated_delivery_time = ? WHERE id = ?
        """, (data["estimatedDeliveryTime"], order_id))
        conn.commit()
        return jsonify({"success": True, "message": f"Estimated arrival updated to {data['estimatedDeliveryTime']}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/api/orders/<order_id>/assign-delivery", methods=["PUT"])
def assign_delivery_boy(order_id):
    data = request.json
    if not data or "deliveryBoyId" not in data or "deliveryBoyName" not in data:
        return jsonify({"error": "Missing 'deliveryBoyId' or 'deliveryBoyName'"}), 400
        
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE orders 
            SET delivery_boy_id = %s, delivery_boy_name = %s, status = 'Out for Delivery' 
            WHERE id = %s
        """ if is_pg else """
            UPDATE orders 
            SET delivery_boy_id = ?, delivery_boy_name = ?, status = 'Out for Delivery' 
            WHERE id = ?
        """, (data["deliveryBoyId"], data["deliveryBoyName"], order_id))
        conn.commit()
        return jsonify({"success": True, "message": f"Assigned {data['deliveryBoyName']} to order {order_id}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/api/orders/<order_id>", methods=["DELETE"])
def delete_order(order_id):
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM orders WHERE id = %s" if is_pg else "DELETE FROM orders WHERE id = ?", (order_id,))
        conn.commit()
        return jsonify({"success": True, "message": f"Order {order_id} deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# --- CUSTOMERS / USERS ENDPOINTS ---

@app.route("/api/customers", methods=["GET"])
def get_customers():
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM app_users ORDER BY name")
        rows = cursor.fetchall()
        customers = []
        for r in rows:
            customers.append({
                "phone": r["phone"] if not is_pg else r[0],
                "name": r["name"] if not is_pg else r[1],
                "address": r["address"] if not is_pg else r[2],
                "ordersCount": r["orders_count"] if not is_pg else r[3],
                "lastOrderDate": r["last_order_date"] if not is_pg else r[4]
            })
        return jsonify(customers)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/api/customers", methods=["POST"])
def add_customer():
    data = request.json
    if not data or not data.get("phone") or not data.get("name"):
        return jsonify({"error": "Missing details"}), 400
        
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO app_users (phone, name, address, orders_count, last_order_date)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address
        """ if is_pg else """
            INSERT OR REPLACE INTO app_users (phone, name, address, orders_count, last_order_date)
            VALUES (?, ?, ?, ?, ?)
        """, (
            data["phone"],
            data["name"],
            data.get("address", ""),
            data.get("ordersCount", 0),
            data.get("lastOrderDate")
        ))
        conn.commit()
        return jsonify({"success": True, "message": "Customer saved successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# --- STAFF & DELIVERY BOY ENDPOINTS ---

@app.route("/api/delivery-boys", methods=["GET"])
def get_delivery_boys():
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM delivery_boys")
        rows = cursor.fetchall()
        riders = []
        for r in rows:
            riders.append({
                "id": r["id"] if not is_pg else r[0],
                "name": r["name"] if not is_pg else r[1],
                "phone": r["phone"] if not is_pg else r[2],
                "vehicle": r["vehicle"] if not is_pg else r[3],
                "status": r["status"] if not is_pg else r[4]
            })
        return jsonify(riders)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/api/staff", methods=["GET"])
def get_staff():
    conn, is_pg = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM staff_members")
        rows = cursor.fetchall()
        staff = []
        for r in rows:
            staff.append({
                "id": r["id"] if not is_pg else r[0],
                "name": r["name"] if not is_pg else r[1],
                "phone": r["phone"] if not is_pg else r[2],
                "role": r["role"] if not is_pg else r[3],
                "shift": r["shift"] if not is_pg else r[4],
                "status": r["status"] if not is_pg else r[5]
            })
        return jsonify(staff)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


if __name__ == "__main__":
    # Create database tables when the application starts
    print("Initializing database tables...")
    init_db()
    print("Database ready.")

    # Render automatically provides the PORT environment variable
    port = int(os.environ.get("PORT", 5000))

    print(f"Starting Flask API Server on port {port}...")

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
