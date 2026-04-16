import pool from "../db/ConnectDB.js";

export const getAllBillsOfPatient =  async (req, res) => {
    try {
        const { pat_id } = req.query;
        const result = await
        pool.query('SELECT billings.id, billings.amount, appointments.date, billings.status FROM billings JOIN appointments ON billings.appointment_id = appointments.id WHERE appointments.pat_id = $1', [pat_id]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const completeBilling = async (req, res) => {
    try {
        const { id } = req.body;
        await pool.query("UPDATE billings SET status = 'Paid' WHERE id = $1", [id]);
        return res.status(200).json({ message: 'Billing completed successfully' });
    } catch (error){
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}