import { Router } from "express";
import { addDoctor, getDoctors, getDoctorsByDepartment, getDoctorsByName } from "../controllers/doctorController.js";

const router = Router();

router.route('/adddoctor').post(addDoctor);
router.route('/getdoctors').get(getDoctors);
router.route('/getdoctorsbyname').get(getDoctorsByName);
router.route('/getdoctorsbydepartment').get(getDoctorsByDepartment);

export default router;