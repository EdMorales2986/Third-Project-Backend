import { Router } from "express";
import {
  //   getTrendingMovies,
  searchMovie,
  filterByYear,
  filterByGenre,
  filterByDuration,
  newestFirst,
  oldestFirst,
  getMovies,
} from "../controllers/movie.controller";

const router = Router();

// router.get("/movies/trending", getTrendingMovies);
router.get("/movies", getMovies);
router.post("/movies/search", searchMovie);
router.get("/movies/filter/year/:startDate/:endDate", filterByYear);
router.post("/movies/filter/genre", filterByGenre); // genre must start with uppercase: Action
router.get("/movies/filter/duration/:duration", filterByDuration); // duration must be in minutes: 110
router.get("/movies/newest", newestFirst);
router.get("/movies/oldest", oldestFirst);

export default router;
