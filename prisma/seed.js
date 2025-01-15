const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = '4020';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Hashed password:', hash);
}

generateHash();