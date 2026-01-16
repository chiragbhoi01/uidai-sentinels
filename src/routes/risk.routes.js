import { Router } from "express";
import {
    getOperators,
    getOperatorById,
    getRiskSummary,
    runDailyComputation,
} from "../controllers/risk.controller.js";

const router = Router();

// --- FINALIZED DEMO-READY ROUTES ---

// GET a paginated, filterable, and sortable list of all operators
router.route("/operators").get(getOperators);

// GET a detailed risk profile for a single operator
router.route("/operators/:operatorId").get(getOperatorById);

// GET a summary of risk levels (for dashboard widgets)
router.route("/summary").get(getRiskSummary);

// POST to trigger the daily risk analysis (for admin/demo purposes)
router.route("/run-daily").post(runDailyComputation);


export default router;