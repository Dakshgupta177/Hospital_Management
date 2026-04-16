import pool from "../db/ConnectDB.js";

export const createBillingsTable = async () => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS billings (
            id BIGSERIAL PRIMARY KEY,
            appointment_id INT REFERENCES appointments(id),
            amount INT NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'Unpaid'
        );`);
    } catch (error) {
        console.error('Error creating patients table:', error);
    }
}