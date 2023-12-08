"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const series_controllers_1 = require("../controllers/series.controllers");
const router = (0, express_1.Router)();
router.get("/series", series_controllers_1.getSeries);
router.post("/series/search", series_controllers_1.searchSerie);
router.get("/series/filter/year/:startDate/:endDate", series_controllers_1.filterByYear); // 2020 - 2023
router.get("/series/filter/genre/:genre", series_controllers_1.filterByGenre); // genre must start with uppercase: "Action & Fantasy"
router.get("/series/newest", series_controllers_1.newestFirst);
router.get("/series/oldest", series_controllers_1.oldestFirst);
exports.default = router;
