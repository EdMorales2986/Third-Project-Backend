"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chats_controllers_1 = require("../../controllers/CHAT/chats.controllers");
const router = (0, express_1.Router)();
router.get("/chat/public", chats_controllers_1.getPublicChats);
// router.get("/chat/private", );
router.post("/chat", chats_controllers_1.createChat);
exports.default = router;
