import express from 'express';
import UsersRouter from './users.router.js';

const router = express.Router();

router.use('/users', UsersRouter);

export default router;
