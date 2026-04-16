export const seedDB = async (pool) => {
  await pool.query(`INSERT INTO doctors (first_name, last_name, dept_id)
        VALUES
  ('Amit', 'Sharma', (SELECT id FROM departments WHERE name = 'General Medicine')),
  ('Neha', 'Verma', (SELECT id FROM departments WHERE name = 'Gynecology')),
  ('Raj', 'Mehta', (SELECT id FROM departments WHERE name = 'Orthopedics')),
  ('Priya', 'Singh', (SELECT id FROM departments WHERE name = 'Pediatrics')),
  ('Karan', 'Patel', (SELECT id FROM departments WHERE name = 'Dermatology')),
  ('Anjali', 'Gupta', (SELECT id FROM departments WHERE name = 'General Medicine')),
  ('Rohit', 'Jain', (SELECT id FROM departments WHERE name = 'Emergency'));`);

  await pool.query(`INSERT INTO patients (first_name, last_name, phone_number, age, gender)
        VALUES
  ('Suresh', 'Kumar', '9876543210', 45, 'Male'),
  ('Anita', 'Sharma', '9123456780', 30, 'Female'),
  ('Vikram', 'Singh', '9988776655', 60, 'Male'),
  ('Pooja', 'Verma', '9876501234', 25, 'Female'),
  ('Ramesh', 'Gupta', '9123456789', 50, 'Male');`);

  await pool.query(
    `INSERT INTO departments (name) VALUES ('General Medicine'), ('Pediatrics'), ('Orthopedics'), ('Gynecology'), ('Dermatology'), ('Emergency');`,
  );
};
