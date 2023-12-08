import { Router } from "express";
import {
  createReview,
  deleteReview,
  editReview,
} from "../controllers/reviews.controller";

const router = Router();

// owner must be like PIPO123
router.post("/reviews/:owner", createReview);
router.delete("/reviews/:owner", deleteReview);
router.put("/reviews/:owner", editReview);

export default router;
