import express from 'express';
import { PointController } from '../controllers/point.controller.js';
import authMiddleware from '../middlewares/auth.middlaware.js';

const router = express.Router();

const pointController = new PointController();

router.post('/payment', pointController.makePayment);
// router.get('/gets', pointController.getPostById);

export default router;