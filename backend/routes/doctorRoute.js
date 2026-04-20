import { Router } from "express";
import { addDoctor, deleteDoctor, editDoctor, getAllDoctors, getDepartments, searchForDoctors } from "../controllers/doctorController.js";

const router = Router();

router.route('/adddoctor').post(addDoctor);
router.route('/getalldoctors').get(getAllDoctors);
router.route('/editdoctor/:id').patch(editDoctor);
router.route('/deletedoctor/:id').delete(deleteDoctor);
router.route('/searchfordoctors').get(searchForDoctors);
router.route('/getdepartments').get(getDepartments);


export default router;