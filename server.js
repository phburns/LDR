const express = require('express');
const cors = require('cors');
const inventoryRouter = require('./src/pages/api/inventory');
const authRoutes = require('./src/pages/api/auth');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/api/inventory', inventoryRouter);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 