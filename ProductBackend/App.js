// express-sqlite-products.js (ES6 modules)
// Single-file Express.js backend using Sequelize (SQLite) for Product management
// Fields: { id, name, description, stock, price }

import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';

const DB_NAME = `ecom_app_db.sqlite`
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `./${DB_NAME}`,
  logging: false,
});

const Product = sequelize.define('Product', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT },
        stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
    }, {
        timestamps: false,   // <-- disables createdAt & updatedAt
    }
);

async function initDb() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  const count = await Product.count();
  if (count === 0) {
    await Product.bulkCreate([
      { name: 'Sample Product A', description: 'Demo product A', stock: 10, price: 19.99 },
      { name: 'Sample Product B', description: 'Demo product B', stock: 5, price: 49.50 },
    ]);
  }
}

// Routes Definition
app.get('/', (req, res) => res.json({ ok: true, service: 'Products API' }));

// API End Points for Product Management
app.get('/products', async (req, res) => {
  try {
    const rows = await Product.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Run Server
const runAppServer = async () => {
    await initDb()
    
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

runAppServer();