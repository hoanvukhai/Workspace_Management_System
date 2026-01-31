const userModel = require('../models/userModel');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function initAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.log('initAdmin: ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin creation');
    return;
  }

  try {
    const existing = await userModel.findUserByEmail(email);
    const hashed = await bcrypt.hash(password, 10);
    if (existing) {
      await db.execute('UPDATE users SET password = ?, role = ?, is_verified = ?, is_active = ? WHERE email = ?', [hashed, 'admin', 1, 1, email]);
      console.log('initAdmin: updated existing user as admin:', email);
    } else {
      const id = uuidv4();
      await db.execute('INSERT INTO users (id, name, email, password, avatar_url, is_active, is_verified, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())', [id, name, email, hashed, null, 1, 1, 'admin']);
      console.log('initAdmin: created new admin user:', email);
    }
  } catch (err) {
    console.error('initAdmin error:', err?.message || err);
  }
}

module.exports = initAdmin;
