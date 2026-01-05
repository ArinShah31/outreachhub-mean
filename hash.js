// hash.js
const bcrypt = require('bcrypt');

async function go() {
  const hash1 = await bcrypt.hash('admin123', 10);
  const hash2 = await bcrypt.hash('arin2025', 10);
  console.log("Super Admin (arin@example.com) →", hash1);
  console.log("Workspace User (you) →", hash2);
}

go();