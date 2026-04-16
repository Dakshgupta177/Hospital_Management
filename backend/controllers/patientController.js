import pool from "../db/ConnectDB.js";

export const getPatients =  async (req, res) => {
    try {
        const page = req.query.page || 1;
        const skip = (page - 1) * 10;
        const result = await pool.query('SELECT * FROM patients LIMIT 10 OFFSET $1', [skip]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const addPatient = async (req, res) => {
    try {
        const { first_name, last_name, phone_number, age, gender} = req.body;
        await pool.query("INSERT INTO patients (first_name, last_name, phone_number, age, gender) VALUES ($1, $2, $3, $4, $5)", [first_name, last_name, phone_number, age, gender]);
        return res.status(201).json({ message: 'Patient added successfully' });
    } catch (error){
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getPatientsByName =  async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const result = await pool.query('SELECT * FROM patients WHERE first_name ILIKE $1 OR last_name ILIKE $1', [`%${name}%`]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}