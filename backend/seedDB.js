import { configDotenv } from "dotenv";
import { Pool } from "pg";
configDotenv();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function seedDB() {
  try {
    await pool.query("BEGIN");

    // 1. Departments first
    await pool.query(`
      INSERT INTO departments (name)
      VALUES 
        ('General Medicine'),
        ('Pediatrics'),
        ('Orthopedics'),
        ('Gynecology'),
        ('Dermatology'),
        ('Emergency')
      ON CONFLICT (name) DO NOTHING;
    `);

    // 2. Doctors
    await pool.query(`
      INSERT INTO doctors (first_name, last_name, dept_id, dob, experience, salary)
      VALUES
        ('Amit', 'Sharma', (SELECT id FROM departments WHERE name = 'General Medicine'), '1985-06-15', 10, 120000),
        ('Neha', 'Verma', (SELECT id FROM departments WHERE name = 'Gynecology'), '1990-03-22', 8, 110000),
        ('Raj', 'Mehta', (SELECT id FROM departments WHERE name = 'Orthopedics'), '1982-11-05', 12, 130000),
        ('Priya', 'Singh', (SELECT id FROM departments WHERE name = 'Pediatrics'), '1992-07-19', 6, 100000),
        ('Karan', 'Patel', (SELECT id FROM departments WHERE name = 'Dermatology'), '1988-01-10', 9, 115000),
        ('Anjali', 'Gupta', (SELECT id FROM departments WHERE name = 'General Medicine'), '1991-09-25', 7, 105000),
        ('Rohit', 'Jain', (SELECT id FROM departments WHERE name = 'Emergency'), '1984-12-30', 11, 125000);
    `);

    // 3. Patients
    await pool.query(`
      INSERT INTO patients (first_name, last_name, phone_number, dob, gender)
      VALUES
        ('Suresh', 'Kumar', '9876543210', '1979-05-12', 'Male'),
        ('Anita', 'Sharma', '9123456780', '1994-08-20', 'Female'),
        ('Vikram', 'Singh', '9988776655', '1965-02-14', 'Male'),
        ('Pooja', 'Verma', '9876501234', '1999-11-03', 'Female'),
        ('Ramesh', 'Gupta', '9123456789', '1974-06-28', 'Male');
    `);

    await pool.query("COMMIT");

    console.log("✅ Database seeded successfully");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("❌ Error seeding database:", err);
  } finally {
    await pool.end();
  }
}

seedDB();