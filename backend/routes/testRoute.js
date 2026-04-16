import { Router } from "express";
import { addTest, getAllTestsOfPatient } from "../controllers/testController.js";

const router = Router();

router.route("/addtest").post(addTest);
router.route("/getalltestsofpatient").get(getAllTestsOfPatient);

export default router;