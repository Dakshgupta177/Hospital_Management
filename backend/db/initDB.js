import { createAppointmentsTable } from "../tables/appointment.js";
import { createBillingsTable } from "../tables/billing.js";
import { createDepartmentsTable, createDoctorsTable } from "../tables/doctor.js";
import { createPatientsTable } from "../tables/patients.js";
import { createTestsTable } from "../tables/test.js";

const initDB = async () => {
    try {
        await createDepartmentsTable();
        await createDoctorsTable();
        await createPatientsTable();
        await createAppointmentsTable();
        await createBillingsTable();
        await createTestsTable();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

export default initDB;