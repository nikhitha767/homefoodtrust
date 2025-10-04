import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'foodhome-secret-key';

// MySQL Connection (XAMPP defaults)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP lo usually blank
  database: 'foodhome'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log('MySQL Connection Error:', err);
    return;
  }
  console.log('✅ Connected to MySQL Database');
  
  // Create database if not exists
  db.query('CREATE DATABASE IF NOT EXISTS foodhome', (err) => {
    if (err) throw err;
    console.log('✅ Database ready');
    
    // Use the database
    db.query('USE foodhome', (err) => {
      if (err) throw err;
      
      // Create sellers table
      const createSellersTable = `
        CREATE TABLE IF NOT EXISTS sellers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          restaurant_name VARCHAR(100) NOT NULL,
          phone VARCHAR(15) NOT NULL,
          address TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      db.query(createSellersTable, (err) => {
        if (err) throw err;
        console.log('✅ Sellers table ready');
      });

      // Create food_items table
      const createFoodItemsTable = `
        CREATE TABLE IF NOT EXISTS food_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          seller_id INT,
          name VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          category ENUM('veg', 'non-veg', 'tiffins', 'sandwich', 'soup', 'others') NOT NULL,
          image_url VARCHAR(255) DEFAULT '',
          is_available BOOLEAN DEFAULT TRUE,
          preparation_time INT DEFAULT 30,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (seller_id) REFERENCES sellers(id)
        )
      `;
      
      db.query(createFoodItemsTable, (err) => {
        if (err) throw err;
        console.log('✅ Food items table ready');
        
        // Insert sample data if empty
        insertSampleData();
      });
    });
  });
});

// Insert sample data
function insertSampleData() {
  // Check if sellers exist
  db.query('SELECT COUNT(*) as count FROM sellers', (err, results) => {
    if (err) throw err;
    
    if (results[0].count === 0) {
      console.log('📝 Inserting sample data...');
      
      // Insert sample sellers
      const sellers = [
        ['Rajesh Kumar', 'rajesh@example.com', '$2a$12$hashedpassword', 'Spice Garden', '9876543210', 'MG Road, Hyderabad'],
        ['Priya Sharma', 'priya@example.com', '$2a$12$hashedpassword', 'Delicious Bites', '9876543211', 'Banjara Hills, Hyderabad']
      ];
      
      sellers.forEach(seller => {
        db.query(
          'INSERT INTO sellers (name, email, password, restaurant_name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
          seller
        );
      });

      // Insert sample food items
      const foodItems = [
        [1, 'Veg Biryani', 'Flavorful vegetable biryani with aromatic spices', 250.00, 'veg', '', 30],
        [1, 'Butter Chicken', 'Creamy and rich butter chicken', 320.00, 'non-veg', '', 25],
        [2, 'Masala Dosa', 'Crispy dosa with potato filling', 80.00, 'tiffins', '', 15],
        [2, 'Veg Sandwich', 'Fresh vegetable sandwich with chutney', 60.00, 'sandwich', '', 10],
        [1, 'Chicken Curry', 'Spicy chicken curry with herbs', 280.00, 'non-veg', '', 20],
        [2, 'Tomato Soup', 'Hot and creamy tomato soup', 90.00, 'soup', '', 5]
      ];
      
      foodItems.forEach(item => {
        db.query(
          'INSERT INTO food_items (seller_id, name, description, price, category, image_url, preparation_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
          item
        );
      });
      
      console.log('✅ Sample data inserted');
    }
  });
}

// ==================== API ROUTES ====================

// Test API
app.get('/', (req, res) => {
  res.json({ 
    message: 'FoodHome Backend with MySQL is running!',
    endpoints: [
      'GET /api/food-items',
      'GET /api/food-items/category/:category',
      'POST /api/sellers/register',
      'POST /api/sellers/login'
    ]
  });
});

// Get all food items
app.get('/api/food-items', (req, res) => {
  const query = `
    SELECT fi.*, s.name as seller_name, s.restaurant_name 
    FROM food_items fi 
    JOIN sellers s ON fi.seller_id = s.id 
    WHERE fi.is_available = true
    ORDER BY fi.created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Get food items by category
app.get('/api/food-items/category/:category', (req, res) => {
  const { category } = req.params;
  const query = `
    SELECT fi.*, s.name as seller_name, s.restaurant_name 
    FROM food_items fi 
    JOIN sellers s ON fi.seller_id = s.id 
    WHERE fi.category = ? AND fi.is_available = true
    ORDER BY fi.created_at DESC
  `;
  
  db.query(query, [category], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Seller Registration
app.post('/api/sellers/register', async (req, res) => {
  try {
    const { name, email, password, restaurantName, phone, address } = req.body;

    // Check if seller exists
    db.query('SELECT id FROM sellers WHERE email = ?', [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Seller already exists with this email' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Insert seller
      db.query(
        `INSERT INTO sellers (name, email, password, restaurant_name, phone, address) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, restaurantName, phone, address],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const token = jwt.sign({ sellerId: results.insertId }, JWT_SECRET, { expiresIn: '7d' });

          res.status(201).json({
            message: 'Seller registered successfully',
            token,
            seller: { 
              id: results.insertId, 
              name, 
              email, 
              restaurantName 
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Seller Login
app.post('/api/sellers/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    db.query('SELECT * FROM sellers WHERE email = ?', [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const seller = results[0];
      const isPasswordValid = await bcrypt.compare(password, seller.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ sellerId: seller.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        message: 'Login successful',
        token,
        seller: {
          id: seller.id,
          name: seller.name,
          email: seller.email,
          restaurantName: seller.restaurant_name
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});