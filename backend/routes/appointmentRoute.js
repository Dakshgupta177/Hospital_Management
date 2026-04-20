import { Router } from "express";
import { addAppointment, deleteAppointment, searchForAppointments } from "../controllers/appointmentController.js";

const router = Router();

router.route("/createappointment").post(addAppointment);
router.route("/searchforappointments").get(searchForAppointments);
router.route("/deleteappointment/:id").delete(deleteAppointment);

export default router;