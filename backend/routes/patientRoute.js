import { Router } from "express";
import { getPatients } from "../controllers/patientController.js";

const router = Router();

router.route('/getdata').get(getPatients);

export default router;