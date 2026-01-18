import { Router } from 'express';
import {
  getRiskSummary,
  getOperators,
  getOperatorById,
} from '../controllers/risk.controller.js';

const router = Router();

// Define routes
router.route('/summary').get(getRiskSummary);
router.route('/operators').get(getOperators);
router.route('/operators/:operatorId').get(getOperatorById);

export default router;
