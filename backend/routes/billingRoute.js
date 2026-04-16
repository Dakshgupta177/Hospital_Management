import { Router } from "express";
import { completeBilling, getAllBillsOfPatient } from "../controllers/billingController.js";

const router = Router();

router.route("/getallbillsofpatient").get(getAllBillsOfPatient);
router.route("/completebilling").patch(completeBilling);

export default router;