"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_controller_1 = require("../controllers/reviews.controller");
const router = (0, express_1.Router)();
router.post("/reviews/movie/:owner", reviews_controller_1.createReview);
router.delete("/reviews/movie/:owner", reviews_controller_1.deleteReview);
router.put("/reviews/movie/:owner", reviews_controller_1.editReview);
exports.default = router;
