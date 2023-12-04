"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_controller_1 = require("../controllers/movie.controller");
const router = (0, express_1.Router)();
// router.get("/movies/trending", getTrendingMovies);
router.post("/movies/search", movie_controller_1.searchMovie);
router.get("/movies/filter/year/:startDate/:endDate", movie_controller_1.filterByYear);
router.get("/movies/filter/genre/:genre", movie_controller_1.filterByGenre);
exports.default = router;
