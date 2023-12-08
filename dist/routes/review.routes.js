"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_controller_1 = require("../controllers/reviews.controller");
const router = (0, express_1.Router)();
// owner must be like PIPO123
router.post("/reviews/:owner", reviews_controller_1.createReview);
router.delete("/reviews/:owner", reviews_controller_1.deleteReview);
router.put("/reviews/:owner", reviews_controller_1.editReview);
router.post("/all/reviews", reviews_controller_1.getReviews);
router.post("/public/reviews", reviews_controller_1.getPublicReviews);
router.post("/critic/reviews", reviews_controller_1.getCriticReviews);
exports.default = router;
