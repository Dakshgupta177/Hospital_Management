import pool from "../db/ConnectDB.js";

export const createDoctorsTable = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS doctors (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            dept_id INT REFERENCES departments(id),
            CONSTRAINT unique_doctor UNIQUE (first_name, last_name, dept_id)
        );`);
  } catch (error) {
    console.error("Error creating doctors table:", error);
  }
};
export const createDepartmentsTable = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS departments (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL
        );`);
  } catch (error) {
    console.error("Error creating departments table:", error);
  }
};
