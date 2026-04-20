import pool from "../db/ConnectDB.js";

export const createTestsTable = async () => {
    const client = await pool.connect();
    try {
        await client.query(`BEGIN;`);

        await client.query(`CREATE TABLE IF NOT EXISTS tests (
            id SERIAL PRIMARY KEY,
            appointment_id INT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
            test_name VARCHAR(100) NOT NULL,
            test_result VARCHAR(255) NOT NULL DEFAULT 'Pending'
        );`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_test_name ON tests(test_name);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_appointment_id ON tests(appointment_id);`);
        await client.query(`COMMIT;`);
    } catch (error) {
        await client.query(`ROLLBACK;`);
        console.error('Error creating patients table:', error);
    } finally {
        client.release();
    }
}