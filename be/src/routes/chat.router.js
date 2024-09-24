import express from 'express';
import { ChatController } from '../controllers/chat.controller.js';

const router = express.Router();
const chatController = new ChatController();

// Define REST API routes for chat
router.post('/message', chatController.saveChatMessage); // Save a new chat message
router.get('/:roomId', chatController.getChatHistory);    // Get chat history by room

export default router;