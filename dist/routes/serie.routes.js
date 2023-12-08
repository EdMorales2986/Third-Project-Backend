"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const series_controllers_1 = require("../controllers/series.controllers");
const router = (0, express_1.Router)();
router.get("/series", series_controllers_1.getSeries);
router.post("/series/search", series_controllers_1.searchSerie);
exports.default = router;
