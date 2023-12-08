import { Router } from "express";
import {
  createComment,
  deleteComment,
  updateComment,
  getComments,
} from "../controllers/comments.controller";

const router = Router();

router.get("/comments/:origin", getComments); // origin comes from review or comment _id
router.post("/comments/create", createComment);
router.delete("/comments/delete/:owner/:id", deleteComment); // owner must be like PIPO123 and id must _id of comment
router.put("/comments/update", updateComment);

export default router;
