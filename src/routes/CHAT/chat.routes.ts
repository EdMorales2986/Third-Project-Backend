import { Router } from "express";
import {
  createChat,
  getPublicChats,
} from "../../controllers/CHAT/chats.controllers";

const router = Router();

router.get("/chat/public", getPublicChats);
// router.get("/chat/private", );
router.post("/chat", createChat);

export default router;
