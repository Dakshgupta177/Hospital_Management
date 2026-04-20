import pool from "../db/ConnectDB.js";

export const getAllPatients =  async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
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
        const { first_name, last_name, phone_number, dob, gender} = req.body;
        const DOB = new Date(dob);
        await pool.query("INSERT INTO patients (first_name, last_name, phone_number, dob, gender) VALUES ($1, $2, $3, $4, $5)", [first_name, last_name, phone_number, DOB, gender]);
        return res.status(201).json({ message: 'Patient added successfully' });
    } catch (error){
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const searchForPatients =  async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const result = await pool.query('SELECT *, EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob)) AS age FROM patients WHERE first_name ILIKE $1 OR last_name ILIKE $1', [`%${search}%`]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const editPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone_number, dob, gender } = req.body;
        const DOB = new Date(dob);
        await pool.query("UPDATE patients SET first_name = $1, last_name = $2, phone_number = $3, dob = $4, gender = $5 WHERE id = $6", [first_name, last_name, phone_number, DOB, gender, id]);
        return res.status(200).json({ message: 'Patient updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM patients WHERE id = $1', [id]);
        return res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}