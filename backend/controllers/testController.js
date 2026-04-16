import pool from "../db/ConnectDB.js";

export const addTest = async (req, res) => {
    try {
        const { appointment_id, test_name, test_result, amount } = req.body;
        await pool.query("INSERT INTO tests (appointment_id, test_name, test_result) VALUES ($1, $2, $3)", [appointment_id, test_name, test_result]);
        await pool.query("UPDATE appointments SET status = 'Completed' WHERE id = $1", [appointment_id]);
        await pool.query("INSERT INTO billings (appointment_id, amount) VALUES ($1, $2)", [appointment_id, amount ]);
        return res.status(201).json({ message: 'Test added successfully' });
    } catch (error){
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getAllTestsOfPatient =  async (req, res) => {
    try {
        const { pat_id } = req.query;
        const result = await pool.query('SELECT tests.test_id, tests.test_name, tests.test_result, appointments.date, billings.amount FROM tests JOIN appointments ON tests.appointment_id = appointments.id JOIN billings ON billings.appointment_id = tests.appointment_id WHERE appointments.pat_id = $1', [pat_id]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}