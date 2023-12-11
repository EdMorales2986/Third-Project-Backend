import { Router } from "express";
import {
  privateChats,
  getPublicChats,
  getMessages,
  sendMessage,
} from "../../controllers/CHAT/chats.controllers";

const router = Router();

router.get("/chat/public", getPublicChats);
// router.get("/chat/private", );
router.post("/chat", privateChats);
router.get("/chat/messages/:roomId", getMessages);
router.post("/chat/message/", sendMessage);
export default router;
