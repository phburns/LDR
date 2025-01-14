const express = require('express');
const cors = require('cors');
const inventoryRouter = require('./src/pages/api/inventory');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/api/inventory', inventoryRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 