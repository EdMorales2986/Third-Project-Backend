import { Router } from "express";
import {
  createReview,
  deleteReview,
  editReview,
  getReviews,
  getPublicReviews,
  getCriticReviews,
} from "../controllers/reviews.controller";

const router = Router();

// owner must be like PIPO123
router.post("/reviews/:owner", createReview);
router.delete("/reviews/:owner", deleteReview);
router.put("/reviews/:owner", editReview);
router.post("/all/reviews", getReviews);
router.post("/public/reviews", getPublicReviews);
router.post("/critic/reviews", getCriticReviews);

export default router;
