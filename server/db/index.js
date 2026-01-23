require('dotenv').config();

const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const schema = require('./schema');

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
    console.warn("⚠️ DATABASE_URL is not set. Database features will not work.");
}

// Use Pool for better connection management
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL database');
        client.release();
        return true;
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
        return false;
    }
};

const db = drizzle(pool, { schema });

module.exports = { db, connectDB, pool };
