import pool from "../db/ConnectDB.js";

export const addTest = async (req, res) => {
  const client = await pool.connect();
  try {
    const { appointment_id, test_name, test_result, amount } = req.body;
    await client.query(`BEGIN;`);
    await client.query(
      "INSERT INTO tests (appointment_id, test_name, test_result) VALUES ($1, $2, $3)",
      [appointment_id, test_name, test_result],
    );
    await client.query(
      "UPDATE appointments SET status = 'Completed' WHERE id = $1",
      [appointment_id],
    );
    await client.query(
      "INSERT INTO billings (appointment_id, amount) VALUES ($1, $2)",
      [appointment_id, amount],
    );
    await client.query(`COMMIT;`);
    return res.status(201).json({ message: "Test added successfully" });
  } catch (error) {
    await client.query(`ROLLBACK;`);
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const searchForTests = async (req, res) => {
  try {
    const { search } = req.query;
    const result = await pool.query(
      "SELECT tests.id, tests.test_name, billings.status, billings.amount, tests.test_result, doctors.first_name AS doctor_first_name, doctors.last_name AS doctor_last_name, patients.first_name AS patient_first_name, patients.last_name AS patient_last_name FROM tests JOIN appointments ON tests.appointment_id = appointments.id JOIN billings ON billings.appointment_id = appointments.id JOIN doctors ON appointments.doc_id = doctors.id JOIN patients ON appointments.pat_id = patients.id WHERE tests.test_name ILIKE $1 OR doctors.first_name ILIKE $1 OR doctors.last_name ILIKE $1 OR patients.first_name ILIKE $1 OR patients.last_name ILIKE $1",
      [`%${search}%`],
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
