import pool from "../db/ConnectDB.js";

export const createAppointmentsTable = async () => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            doc_id INT REFERENCES doctors(id),
            pat_id INT REFERENCES patients(id),
            date DATE NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'Scheduled'
        );`);
    } catch (error) {
        console.error('Error creating patients table:', error);
    }
}