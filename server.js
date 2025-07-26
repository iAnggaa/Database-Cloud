require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');
const playerRouters = require('./routes/playerRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3100',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', playerRouters);

// Start Server
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

