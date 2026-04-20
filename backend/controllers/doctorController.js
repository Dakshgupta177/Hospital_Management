import pool from "../db/ConnectDB.js";

export const addDoctor = async (req, res) => {
  try {
    const { first_name, last_name, department, dob, experience, salary } =
      req.body;
    const DOB = new Date(dob);
    await pool.query(
      "INSERT INTO doctors (first_name, last_name, dept_id, dob, experience, salary) VALUES ($1, $2, (SELECT id FROM departments WHERE name = $3), $4, $5, $6)",
      [first_name, last_name, `${department}`, DOB, experience, salary],
    );
    return res.status(201).json({ message: "Doctor added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const Id = parseInt(id);
    const { first_name, last_name, department, dob, experience, salary } =
      req.body;
    if (!dob || isNaN(Date.parse(dob))) {
      return res.status(400).json({ message: "Invalid DOB" });
    }
    const DOB = new Date(dob);
    console.log(DOB);

    console.log(department, dob, experience, salary, Id, first_name, last_name);
    await pool.query(
      "UPDATE doctors SET first_name = $1, last_name = $2, dept_id = (SELECT id FROM departments WHERE name = $3), dob = $4, experience = $5, salary = $6 WHERE id = $7;",
      [first_name, last_name, `${department}`, dob, experience, salary, Id],
    );
    return res.status(200).json({ message: "Doctor updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const Id = parseInt(id);
    await pool.query("DELETE FROM doctors WHERE id = $1", [Id]);
    return res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * 10;
    const result = await pool.query(
      "SELECT d.id, d.first_name, d.last_name, dep.name AS department, d.dob, d.experience, d.salary FROM doctors d JOIN departments dep ON d.dept_id = dep.id LIMIT 10 OFFSET $1;",
      [skip],
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchForDoctors = async (req, res) => {
  try {
    const { search } = req.query;
    const result = await pool.query(
      "SELECT d.id, d.first_name, d.last_name, dep.name AS department, d.experience, d.dob, d.salary FROM doctors d JOIN departments dep ON d.dept_id = dep.id WHERE dep.name ILIKE $1 OR d.first_name ILIKE $1 OR d.last_name ILIKE $1;",
      [`%${search}%`],
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM departments");
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
