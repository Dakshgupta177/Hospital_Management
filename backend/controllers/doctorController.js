import pool from "../db/ConnectDB.js";

export const getDoctorsByName =  async (req, res) => {
    try {
        const { name } = req.query;
        const result = await pool.query('SELECT * FROM doctors JOIN departments ON departments.id = doctors.dept_id WHERE first_name ILIKE $1 OR last_name ILIKE $1', [`%${name}%`]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const addDoctor = async (req, res) => {
    try {
        const { first_name, last_name, department } = req.body;
        await pool.query("INSERT INTO doctors (first_name, last_name, dept_id) VALUES ($1, $2, (SELECT id FROM departments WHERE name = $3))", [first_name, last_name, `${department}`]);
        return res.status(201).json({ message: 'Doctor added successfully' });
    } catch (error){
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getDoctors =  async (req, res) => {
    try {
        const page = req.query.page || 1;
        const skip = (page - 1) * 10;
        const result = await pool.query
        ('SELECT doctors.id, doctors.first_name, doctors.last_name, departments.name AS department FROM doctors JOIN departments ON doctors.dept_id = departments.id LIMIT 10 OFFSET $1', [skip]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getDoctorsByDepartment =  async (req, res) => {
    try {
        const { department } = req.query;
        const page = req.query.page || 1;
        const skip = (page - 1) * 10;
        const result = await
        pool.query('SELECT doctors.id, doctors.first_name, doctors.last_name, departments.name AS department FROM doctors JOIN departments ON doctors.dept_id = departments.id WHERE departments.name ILIKE $1 LIMIT 10 OFFSET $2', [`%${department}%`, skip]);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}