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
  // Chuyển các placeholder MySQL `?` sang PostgreSQL $1, $2, ... để giữ tương thích
  _convertPlaceholders(sql) {
    let idx = 1;
    return sql.replace(/\?/g, () => `$${idx++}`);
  },

  async execute(sql, params) {
    try {
      const convertedSql = sql.includes('?') ? this._convertPlaceholders(sql) : sql;
      const result = await pool.query(convertedSql, params);
      return [result.rows];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  
  async query(sql, params) {
    try {
      const convertedSql = sql.includes('?') ? this._convertPlaceholders(sql) : sql;
      const result = await pool.query(convertedSql, params);
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
        const convertedSql = sql.includes('?') ? (function() {
          let idx = 1;
          return sql.replace(/\?/g, () => `$${idx++}`);
        })() : sql;
        const result = await client.query(convertedSql, params);
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