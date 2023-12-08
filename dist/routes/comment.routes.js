"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_controller_1 = require("../controllers/comments.controller");
const router = (0, express_1.Router)();
router.get("/comments/:origin", comments_controller_1.getComments); // origin comes from review or comment _id
router.post("/comments/create", comments_controller_1.createComment);
router.delete("/comments/delete/:owner/:id", comments_controller_1.deleteComment); // owner must be like PIPO123 and id must _id of comment
router.put("/comments/update", comments_controller_1.updateComment);
exports.default = router;
