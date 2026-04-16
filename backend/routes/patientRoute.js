import { Router } from "express";
import { addPatient, getPatients, getPatientsByName } from "../controllers/patientController.js";

const router = Router();

router.route('/addpatient').post(addPatient);
router.route('/getpatients').get(getPatients);
router.route('/getpatientsbyname').get(getPatientsByName);

export default router;