import { Router } from "express";
import { searchSerie, getSeries } from "../controllers/series.controllers";

const router = Router();

router.get("/series", getSeries);
router.post("/series/search", searchSerie);

export default router;
