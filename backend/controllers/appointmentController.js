import pool from "../db/ConnectDB.js";

export const addAppointment = async (req, res) => {
    try {
        const { doc_id, pat_id, date } = req.body;
        await pool.query("INSERT INTO appointments (doc_id, pat_id, date) VALUES ($1, $2, $3)", [doc_id, pat_id, date]);
        return res.status(201).json({ message: 'Appointment added successfully' });
    } catch (error){
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getAppointmentsByStatus =  async (req, res) => {
    try {
        const { status } = req.query;

        const page = req.query.page || 1;
        const skip = (page - 1) * 10;
        const result = await
        pool.query('SELECT appointments.id, doctors.first_name AS doctor_first_name, doctors.last_name AS doctor_last_name, patients.first_name AS patient_first_name, patients.last_name AS patient_last_name, appointments.date FROM appointments JOIN doctors ON appointments.doc_id = doctors.id JOIN patients ON appointments.pat_id = patients.id  WHERE status = $1  LIMIT 10 OFFSET $2', [`${status}`,skip]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getAppointmentsByDate =  async (req, res) => {
    try {
        const { date } = req.query;
        const page = req.query.page || 1;
        const skip = (page - 1) * 10;
        const result = await pool.query
        ('SELECT appointments.id, doctors.first_name AS doctor_first_name, doctors.last_name AS doctor_last_name, patients.first_name AS patient_first_name, patients.last_name AS patient_last_name, appointments.date FROM appointments JOIN doctors ON appointments.doc_id = doctors.id JOIN patients ON appointments.pat_id = patients.id  WHERE date = $1 LIMIT 10 OFFSET $2', [date, skip]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getAppointmentsByName =  async (req, res) => {
    try {
        const { name } = req.query;
        const page = req.query.page || 1;
        const skip = (page - 1) * 10;
        const result = await
        pool.query('SELECT appointments.id, doctors.first_name AS doctor_first_name, doctors.last_name AS doctor_last_name, patients.first_name AS patient_first_name, patients.last_name AS patient_last_name, appointments.date FROM appointments JOIN doctors ON appointments.doc_id = doctors.id JOIN patients ON appointments.pat_id = patients.id  WHERE doctors.first_name ILIKE $1 OR doctors.last_name ILIKE $1 OR patients.first_name ILIKE $1 OR patients.last_name ILIKE $1 LIMIT 10 OFFSET $2', [`%${name}%`, skip]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}