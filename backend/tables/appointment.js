import pool from "../db/ConnectDB.js";

export const createAppointmentsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`BEGIN;`);
    await client.query(`CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            doc_id INT REFERENCES doctors(id) NOT NULL,
            pat_id INT REFERENCES patients(id) NOT NULL,
            date DATE NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'Scheduled'
        );`);
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_doc_id ON appointments(doc_id);`,
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_pat_id ON appointments(pat_id);`,
    );
    await client.query(`COMMIT;`);
  } catch (error) {
    await client.query(`ROLLBACK;`);
    console.error("Error creating patients table:", error);
  } finally {
    client.release();
  }
};
