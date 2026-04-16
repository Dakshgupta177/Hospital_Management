import pool from "../db/ConnectDB.js";

export const createTestsTable = async () => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS tests (
            test_id SERIAL PRIMARY KEY,
            appointment_id INT REFERENCES appointments(id),
            test_name VARCHAR(100) NOT NULL,
            test_result VARCHAR(255) NOT NULL DEFAULT 'Pending'
        );`);
    } catch (error) {
        console.error('Error creating patients table:', error);
    }
}