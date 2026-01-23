require('dotenv').config();

// FIX: Force disable SSL verification for local Drizzle Studio
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/** @type { import("drizzle-kit").Config } */
module.exports = {
    schema: "./db/schema.js",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    },
};
