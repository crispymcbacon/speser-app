// Config connection to database, the configurations uses environment variables
import pkg from 'pg';
const { Pool } = pkg;

// Import environment variables if necessary
// In production, you should use a more secure system like server environment variables or secret manager
import dotenv from 'dotenv';
dotenv.config();

// Create a new connection pool using the set credentials and parameters
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'default_db',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false, // Note: { rejectUnauthorized: false } for unverified SSL connections (not recommended for production)
});

export const query = (text, params, callback) => {
    return pool.query(text, params, callback)
  }