#!/usr/bin/env node
require('dotenv').config();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createAdmin(email, password, name = null) {
  if (!email || !password) {
    console.error('Usage: node createAdminUser.js email@example.com StrongP@ssw0rd [Name]');
    process.exit(2);
  }

  try {
    const [rows] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    const hashed = await bcrypt.hash(password, 10);

    if (rows && rows[0]) {
      // User exists -> update password, role, verify
      await db.execute('UPDATE users SET password = ?, role = ?, is_verified = ?, is_active = ? WHERE email = ?', [hashed, 'admin', 1, 1, email]);
      console.log('Updated existing user to admin and set new password:', email);
      process.exit(0);
    }

    const id = uuidv4();
    const userName = name || email.split('@')[0];
    await db.execute(
      'INSERT INTO users (id, name, email, password, avatar_url, is_active, is_verified, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [id, userName, email, hashed, null, 1, 1, 'admin']
    );
    console.log('Created new admin user:', email);
    console.log('Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err.message || err);
    process.exit(1);
  }
}

const [,, email, password, name] = process.argv;
createAdmin(email, password, name);
