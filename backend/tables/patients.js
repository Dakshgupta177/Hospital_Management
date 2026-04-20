import pool from "../db/ConnectDB.js";

export const createPatientsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`BEGIN;`);
    await client.query(`CREATE TABLE IF NOT EXISTS patients (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            phone_number VARCHAR(15) NOT NULL,
            dob DATE NOT NULL,
            gender VARCHAR(10) NOT NULL
            );`);
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_first_name_pat ON patients(first_name);`,
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_last_name_pat ON patients(last_name);`,
    );
    await client.query(`COMMIT;`);
  } catch (error) {
    await client.query(`ROLLBACK;`);
    console.error("Error creating patients table:", error);
  } finally {
    client.release();
  }
};
