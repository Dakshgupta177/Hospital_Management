import pool from "../db/ConnectDB.js";

export const createPatientsTable = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS patients (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            phone_number VARCHAR(15) NOT NULL,
            age INT NOT NULL CHECK (age > 0),
            gender VARCHAR(10) NOT NULL
            );`);
  } catch (error) {
    console.error("Error creating patients table:", error);
  }
};
