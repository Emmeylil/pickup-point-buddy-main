const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const dbPath = path.join(__dirname, 'pickup_points.db');

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Database setup
const db = new Database(dbPath);

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS pickup_stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    timeOpenedWeek TEXT,
    timeOpenedWeekend TEXT,
    number TEXT,
    address TEXT,
    state TEXT,
    email TEXT,
    landmark TEXT,
    latitude REAL,
    longitude REAL
  )
`);

// Seed data if table is empty
const rowCount = db.prepare('SELECT count(*) as count FROM pickup_stations').get();
if (rowCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO pickup_stations (name, timeOpenedWeek, timeOpenedWeekend, number, address, state, email, landmark, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialData = [
    {
      name: "Downtown Pickup Center",
      timeOpenedWeek: "8:00 AM - 8:00 PM",
      timeOpenedWeekend: "9:00 AM - 6:00 PM",
      number: "+1-555-0123",
      address: "123 Main Street, Downtown",
      state: "Lagos",
      email: "downtown@pickup.com",
      landmark: "Near Central Bank",
      latitude: 6.5244,
      longitude: 3.3792,
    },
    {
      name: "Ikeja Express Station",
      timeOpenedWeek: "7:00 AM - 9:00 PM",
      timeOpenedWeekend: "8:00 AM - 7:00 PM",
      number: "+1-555-0124",
      address: "45 Ikeja Way, Ikeja",
      state: "Lagos",
      email: "ikeja@pickup.com",
      landmark: "Opposite Shoprite Mall",
      latitude: 6.6018,
      longitude: 3.3515,
    },
    {
      name: "Victoria Island Hub",
      timeOpenedWeek: "9:00 AM - 7:00 PM",
      timeOpenedWeekend: "10:00 AM - 5:00 PM",
      number: "+1-555-0125",
      address: "78 Ahmadu Bello Way, Victoria Island",
      state: "Lagos",
      email: "vi@pickup.com",
      landmark: "Near Eko Hotel",
      latitude: 6.4281,
      longitude: 3.4219,
    },
  ];

  const insertMany = db.transaction((stations) => {
    for (const s of stations) {
      insert.run(s.name, s.timeOpenedWeek, s.timeOpenedWeekend, s.number, s.address, s.state, s.email, s.landmark, s.latitude, s.longitude);
    }
  });

  insertMany(initialData);
  console.log('Database seeded with initial pickup stations.');
}

// API Routes
app.get('/api/pickup-stations', (req, res) => {
  try {
    const stations = db.prepare('SELECT * FROM pickup_stations').all();
    res.json(stations);
  } catch (error) {
    console.error('Error fetching pickup stations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
