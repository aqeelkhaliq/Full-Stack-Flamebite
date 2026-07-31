

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        console.error(' Database connection failed:', err.message);
    } else {
        console.log(' Connected to Supabase PostgreSQL!');
        release();
    }
});

module.exports = pool;