import pool from "../db/ConnectDB.js";

export const createDoctorsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`BEGIN;`);
    await client.query(`CREATE TABLE IF NOT EXISTS doctors (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            dob DATE NOT NULL,
            experience INT DEFAULT 0,
            salary INT NOT NULL,
            dept_id INT REFERENCES departments(id) NOT NULL,
            CONSTRAINT unique_doctor UNIQUE (first_name, last_name, dept_id)
        );`);
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_first_name_doc ON doctors(first_name);`,
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_last_name_doc ON doctors(last_name);`,
    );
    await client.query(`COMMIT;`);
  } catch (error) {
    await client.query(`ROLLBACK;`);
    console.error("Error creating doctors table:", error);
  } finally {
    client.release();
  }
};

export const createDepartmentsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`BEGIN;`);
    await client.query(`CREATE TABLE IF NOT EXISTS departments (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL
        );`);
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_department_name ON departments(name);`,
    );
    await client.query(`COMMIT;`);
  } catch (error) {
    await client.query(`ROLLBACK;`);
    console.error("Error creating departments table:", error);
  } finally {
    client.release();
  }
};
