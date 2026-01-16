import { Router } from 'express';
import riskRouter from './risk.routes.js';

const router = Router();

router.use('/risk', riskRouter);
// Future routes can be added here
// router.use('/users', userRouter);

export default router;
