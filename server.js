const express = require('express');
const cors = require('cors');
const inventoryRouter = require('./src/pages/api/inventory');
const authRoutes = require('./src/pages/api/auth');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Test database connection
async function testConnection() {
  try {
    console.log('Testing database connection...');
    // Try to query the database
    await prisma.machine.findFirst();
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection error:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  }
}

testConnection();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '50mb' }));
app.use('/api/inventory', inventoryRouter);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 