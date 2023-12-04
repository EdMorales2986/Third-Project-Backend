import { Router } from "express";
import {
  createReview,
  deleteReview,
  editReview,
} from "../controllers/reviews.controller";

const router = Router();

router.post("/reviews/movie/:owner", createReview);
router.delete("/reviews/movie/:owner", deleteReview);
router.put("/reviews/movie/:owner", editReview);

export default router;
