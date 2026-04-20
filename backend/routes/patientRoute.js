import { Router } from "express";
import { addPatient, deletePatient, editPatient, getAllPatients, searchForPatients } from "../controllers/patientController.js";

const router = Router();

router.route('/addpatient').post(addPatient);
router.route('/getallpatients').get(getAllPatients);
router.route('/searchforpatients').get(searchForPatients);
router.route('/editpatient/:id').patch(editPatient);
router.route('/deletepatient/:id').delete(deletePatient);

export default router;