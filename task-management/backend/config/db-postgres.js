const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Wrapper để tương thích với MySQL code
const db = {
  async execute(sql, params) {
    try {
      const result = await pool.query(sql, params);
      return [result.rows];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  
  async query(sql, params) {
    try {
      const result = await pool.query(sql, params);
      return [result.rows];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  async getConnection() {
    const client = await pool.connect();
    return {
      async execute(sql, params) {
        const result = await client.query(sql, params);
        return [result.rows];
      },
      async beginTransaction() {
        await client.query('BEGIN');
      },
      async commit() {
        await client.query('COMMIT');
      },
      async rollback() {
        await client.query('ROLLBACK');
      },
      release() {
        client.release();
      }
    };
  }
};

module.exports = db;