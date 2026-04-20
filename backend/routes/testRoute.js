import { Router } from "express";
import { addTest, searchForTests } from "../controllers/testController.js";

const router = Router();

router.route("/addtest").post(addTest);
router.route("/searchfortests").get(searchForTests);

export default router;