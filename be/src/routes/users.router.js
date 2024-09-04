import express from 'express';
import { UsersController } from '../controllers/users.controller.js';
import authMiddleware from '../middlewares/auth.middlaware.js';

const router = express.Router();

const usersController = new UsersController();

router.post('/signup', usersController.createUser)
router.post('/signin', usersController.login)
router.get('/users', usersController.getUsers);
router.get('/findId/:id', authMiddleware, usersController.getUserById);
router.get('/findEmail/:email', authMiddleware, usersController.getUserByEmail);
router.patch('/update/:id', authMiddleware, usersController.updateUser);
router.delete('/delete/:id', authMiddleware, usersController.deleteUser);

export default router;