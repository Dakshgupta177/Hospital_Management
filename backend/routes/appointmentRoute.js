import { Router } from "express";
import { addAppointment, getAppointmentsByDate, getAppointmentsByName, getAppointmentsByStatus } from "../controllers/appointmentController.js";

const router = Router();

router.route("/bookappointment").post(addAppointment);
router.route("/getappointmentbyname").get(getAppointmentsByName);
router.route("/getappointmentbydate").get(getAppointmentsByDate);
router.route("/getappointmentbystatus").get(getAppointmentsByStatus);

export default router;