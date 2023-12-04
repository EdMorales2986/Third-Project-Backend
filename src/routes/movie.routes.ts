import { Router } from "express";
import {
  //   getTrendingMovies,
  searchMovie,
  filterByYear,
  filterByGenre,
} from "../controllers/movie.controller";

const router = Router();

// router.get("/movies/trending", getTrendingMovies);
router.post("/movies/search", searchMovie);
router.get("/movies/filter/year/:startDate/:endDate", filterByYear);
router.get("/movies/filter/genre/:genre", filterByGenre);

export default router;
