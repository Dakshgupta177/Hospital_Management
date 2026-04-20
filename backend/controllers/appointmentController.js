import pool from "../db/ConnectDB.js";

export const addAppointment = async (req, res) => {
  try {
    const { doc_id, pat_id, date } = req.body;
    console.log(doc_id, pat_id, date);
    
    await pool.query(
      "INSERT INTO appointments (doc_id, pat_id, date) VALUES ($1, $2, $3)",
      [doc_id, pat_id, date],
    );
    return res.status(201).json({ message: "Appointment added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM appointments WHERE id = $1", [id]);
    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchForAppointments = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: "Status is required" });
    }
    const result = await pool.query(
      "SELECT appointments.id, appointments.status, doctors.first_name AS doctor_first_name, doctors.last_name AS doctor_last_name, patients.first_name AS patient_first_name, patients.last_name AS patient_last_name, appointments.date FROM appointments JOIN doctors ON appointments.doc_id = doctors.id JOIN patients ON appointments.pat_id = patients.id  WHERE doctors.first_name ILIKE $1 OR doctors.last_name ILIKE $1 OR patients.first_name ILIKE $1 OR patients.last_name ILIKE $1",
      [`%${search}%`],
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};