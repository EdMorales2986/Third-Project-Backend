import { Router } from "express";
import {
  //   getTrendingMovies,
  searchMovie,
  filterByYear,
  filterByGenre,
  filterByDuration,
  newestFirst,
  oldestFirst,
} from "../controllers/movie.controller";

const router = Router();

// router.get("/movies/trending", getTrendingMovies);
router.post("/movies/search", searchMovie);
router.get("/movies/filter/year/:startDate/:endDate", filterByYear);
router.get("/movies/filter/genre/:genre", filterByGenre);
router.get("/movies/filter/duration/:duration", filterByDuration);
router.get("/movies/newest", newestFirst);
router.get("/movies/oldest", oldestFirst);

export default router;
