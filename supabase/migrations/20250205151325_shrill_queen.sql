/*
  # Initial Schema Setup for Food Delivery Application

  1. Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - full_name (text)
      - phone (text)
      - role (enum: customer, restaurant_owner, delivery_partner, admin)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - restaurants
      - id (uuid, primary key)
      - owner_id (uuid, foreign key to users)
      - name (text)
      - description (text)
      - cuisine_type (text)
      - address (text)
      - latitude (float8)
      - longitude (float8)
      - opening_hours (jsonb)
      - rating (float4)
      - is_active (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)

    - menu_items
      - id (uuid, primary key)
      - restaurant_id (uuid, foreign key to restaurants)
      - name (text)
      - description (text)
      - price (numeric)
      - category (text)
      - image_url (text)
      - is_available (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)

    - orders
      - id (uuid, primary key)
      - user_id (uuid, foreign key to users)
      - restaurant_id (uuid, foreign key to restaurants)
      - delivery_partner_id (uuid, foreign key to users)
      - status (enum: pending, confirmed, preparing, out_for_delivery, delivered, cancelled)
      - total_amount (numeric)
      - delivery_address (text)
      - delivery_coordinates (point)
      - created_at (timestamp)
      - updated_at (timestamp)

    - order_items
      - id (uuid, primary key)
      - order_id (uuid, foreign key to orders)
      - menu_item_id (uuid, foreign key to menu_items)
      - quantity (integer)
      - unit_price (numeric)
      - subtotal (numeric)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each user role
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'restaurant_owner', 'delivery_partner', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  role user_role DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create restaurants table
CREATE TABLE restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES users(id),
  name text NOT NULL,
  description text,
  cuisine_type text,
  address text NOT NULL,
  latitude float8,
  longitude float8,
  opening_hours jsonb,
  rating float4 DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text,
  image_url text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  restaurant_id uuid REFERENCES restaurants(id),
  delivery_partner_id uuid REFERENCES users(id),
  status order_status DEFAULT 'pending',
  total_amount numeric NOT NULL,
  delivery_address text NOT NULL,
  delivery_coordinates point,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  menu_item_id uuid REFERENCES menu_items(id),
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  subtotal numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for restaurants table
CREATE POLICY "Anyone can view active restaurants"
  ON restaurants
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Restaurant owners can manage their restaurants"
  ON restaurants
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- Create policies for menu_items table
CREATE POLICY "Anyone can view menu items"
  ON menu_items
  FOR SELECT
  USING (true);

CREATE POLICY "Restaurant owners can manage menu items"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = menu_items.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Create policies for orders table
CREATE POLICY "Customers can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Restaurant owners can view their restaurant orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = orders.restaurant_id
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Delivery partners can view assigned orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (delivery_partner_id = auth.uid());

-- Create policies for order_items table
CREATE POLICY "Users can view their order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_delivery_partner ON orders(delivery_partner_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);