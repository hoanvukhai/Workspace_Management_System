#!/usr/bin/env node
require('dotenv').config();
const db = require('../config/db');

async function grantAdmin(email) {
  if (!email) {
    console.error('Usage: node grantAdmin.js user@example.com');
    process.exit(2);
  }

  try {
    const [rows] = await db.execute('SELECT id, email, role FROM users WHERE email = ?', [email]);
    if (!rows[0]) {
      console.error('User not found:', email);
      process.exit(3);
    }

    await db.execute("UPDATE users SET role = 'admin' WHERE email = ?", [email]);
    console.log('User promoted to admin:', email);
    process.exit(0);
  } catch (err) {
    console.error('Error granting admin:', err.message || err);
    process.exit(1);
  }
}

const email = process.argv[2];
grantAdmin(email);
