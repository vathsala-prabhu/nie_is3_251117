// express-sqlite-Flights.js (ES6 modules)
// Single-file Express.js backend using Sequelize (SQLite) for Flight management
// Fields: { id, name, description, stock, price }

import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';

const DB_NAME = `ars_db.sqlite`
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

const Flight = sequelize.define('Flight', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        number: { type: DataTypes.INTEGER, allowNull: false },
        source: { type: DataTypes.STRING },
        destination:  { type: DataTypes.STRING },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
    }, {
        timestamps: false,   // <-- disables createdAt & updatedAt
    }
);

async function initDb() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  const count = await Flight.count();
  if (count === 0) {
    await Flight.bulkCreate([
      { number: 5, source : 'Mysore', destination: 'Delhi', price: 5000 },
      { number: 6, source: 'Banglore', destination: 'NewYork', price: 58000 },
    ]);
  }
}

// Routes Definition
app.get('/', (req, res) => res.json({ ok: true, service: 'Flights API' }));

// API End Points for Flight Management
app.get('/Flights', async (req, res) => {
  try {
    const rows = await Flight.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/Flights/:id', async (req, res) => {
  try {
    const Flight = await Flight.findByPk(parseInt(req.params.id));
    if (!Flight) {
        return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(Flight);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/Flights', async (req, res) => {
  try {
    const Flight = await Flight.create(req.body);
    res.status(201).json(Flight);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/Flights/:id', async (req, res) => {
  try {
    const Flight = await Flight.findByPk(parseInt(req.params.id));
    if (!Flight) {
        return res.status(404).json({ error: 'Flight not found' });
    }
    await Flight.update(req.body);
    res.json(Flight);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/Flights/:id', async (req, res) => {
  try {
    const Flight = await Flight.findByPk(parseInt(req.params.id));
    if (!Flight) return res.status(404).json({ error: 'Flight not found' });
    await Flight.destroy();
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