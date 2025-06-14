const mysql = require('mysql2/promise');
const { logger } = require('../utils/logger');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'health_predictions',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database tables
async function initializeDatabase() {
    try {
        // Create predictions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS predictions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                prediction_type ENUM('heart', 'diabetes') NOT NULL,
                input_data JSON NOT NULL,
                prediction_result JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create users table (for future use)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        logger.info('Database tables initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize database:', error);
        throw error;
    }
}

// Initialize database on startup
initializeDatabase().catch(error => {
    logger.error('Database initialization failed:', error);
    process.exit(1);
});

module.exports = {
    query: (sql, params) => pool.query(sql, params),
    pool
}; 