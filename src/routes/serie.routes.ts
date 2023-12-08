import { Router } from "express";
import {
  searchSerie,
  getSeries,
  filterByYear,
  filterByGenre,
  newestFirst,
  oldestFirst,
} from "../controllers/series.controllers";

const router = Router();

router.get("/series", getSeries);
router.post("/series/search", searchSerie);
router.get("/series/filter/year/:startDate/:endDate", filterByYear); // 2020 - 2023
router.get("/series/filter/genre/:genre", filterByGenre); // genre must start with uppercase: "Action & Fantasy"
router.get("/series/newest", newestFirst);
router.get("/series/oldest", oldestFirst);

export default router;
