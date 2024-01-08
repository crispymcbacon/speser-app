import pkg from 'pg';
const { Pool } = pkg; 

//mport dotenv from 'dotenv'; // DEVELOPMENT ONLY
//dotenv.config(); // DEVELOPMENT ONLY

// Create a new connection pool using the set credentials and parameters
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'default_db',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false, // Note: { rejectUnauthorized: false } for unverified SSL connections (not recommended for production)
});

export const query = (text, params) => {
    return new Promise((resolve, reject) => {
        pool.query(text, params, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}