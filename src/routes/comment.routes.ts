import { Router } from "express";
import {
  createComment,
  deleteComment,
  updateComment,
  getComments,
} from "../controllers/comments.controller";

const router = Router();

router.get("/comments/:origin", getComments);
router.post("/comments/create", createComment);
router.delete("/comments/delete/:owner/:id", deleteComment);
router.put("/comments/update", updateComment);

export default router;
