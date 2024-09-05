import express from 'express';
import UsersRouter from './users.router.js';
import PostsRouter from './posts.router.js';

const router = express.Router();

router.use('/users', UsersRouter);
router.use('/posts', PostsRouter)

export default router;
