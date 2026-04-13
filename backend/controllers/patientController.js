import pool from "../db/ConnectDB.js";

export const getPatients =  async (req, res) => {
    try {
        const page = req.query.page || 1;
        const skip = (page - 1) * 10;
        const result = await pool.query('SELECT * FROM patients LIMIT 10 OFFSET $1', [skip]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}