"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oldestFirst = exports.newestFirst = exports.filterByGenre = exports.filterByYear = exports.getSeries = exports.searchSerie = void 0;
const series_1 = __importDefault(require("../models/series"));
const moviedb_promise_1 = require("moviedb-promise");
const TMDB = new moviedb_promise_1.MovieDb(`${process.env.APIKEY}`);
const createEntries = function (series) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        for (const tv of series) {
            const tvInfo = yield TMDB.tvInfo({
                id: `${tv.id}`,
                language: "en",
            });
            if (!tvInfo.first_air_date ||
                !tvInfo.overview ||
                (tvInfo.original_language !== "en" && tvInfo.original_language !== "es")) {
                continue;
            }
            const seasons = (_a = tvInfo.seasons) === null || _a === void 0 ? void 0 : _a.filter((season) => season.air_date !== null).map((season) => ({
                number: season.season_number,
                name: season.name,
                episodes: season.episode_count,
                airdate: season.air_date,
            }));
            // console.log(seasons);
            const entry = new series_1.default({
                title: tvInfo.name,
                posterURL: `https://image.tmdb.org/t/p/w500${tvInfo.poster_path}`,
                genres: (_b = tvInfo.genres) === null || _b === void 0 ? void 0 : _b.map((genre) => genre.name),
                overview: tvInfo.overview,
                firstAirDate: tvInfo.first_air_date,
                lastAirDate: tvInfo.last_air_date,
                trailerURL: ``,
                seasons: seasons,
            });
            const videos = yield TMDB.tvVideos({
                id: `${tv.id}`,
                language: "en",
            }).then((data) => {
                var _a;
                const trailer = (_a = data.results) === null || _a === void 0 ? void 0 : _a.find((element) => element.type === "Trailer");
                if (!trailer) {
                    entry.trailerURL = "not available";
                }
                else {
                    entry.trailerURL = `https://www.youtube.com/watch?v=${trailer === null || trailer === void 0 ? void 0 : trailer.key}`;
                }
            });
            yield entry.save();
        }
    });
};
const searchSerie = function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { query } = req.body;
            const series = yield series_1.default.find({
                title: { $regex: `${query}`, $options: "i" },
            }).lean();
            if (!series || series.length === 0) {
                const serieQuery = yield TMDB.searchTv({
                    query: `${query}`,
                    language: "en",
                });
                if (!serieQuery || ((_a = serieQuery.results) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                    return res.status(400).json({ msg: "Movie not found" });
                }
                const series = serieQuery.results;
                yield createEntries(series);
                const response = yield series_1.default.find({
                    title: { $regex: `${query}`, $options: "i" },
                }).lean();
                if (!response || response.length === 0) {
                    return res.status(400).json({ msg: "Movie not found" });
                }
                return res.status(200).json(response);
            }
            return res.status(200).json(series);
        }
        catch (err) {
            return res.status(400).json(err);
        }
    });
};
exports.searchSerie = searchSerie;
const getSeries = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const series = yield series_1.default.find().lean();
            if (!series || series.length === 0) {
                return res.status(400).json({ msg: "Series not found" });
            }
            return res.status(200).json(series);
        }
        catch (err) {
            return res.status(400).json(err);
        }
    });
};
exports.getSeries = getSeries;
const filterByYear = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { startDate, endDate } = req.params;
            const series = yield series_1.default.find({
                firstAirDate: {
                    $gte: startDate,
                    $lte: endDate,
                },
            }).lean();
            if (!series || series.length === 0) {
                return res.status(400).json({ msg: "Series not found" });
            }
            return res.status(200).json(series);
        }
        catch (err) {
            return res.status(400).json(err);
        }
    });
};
exports.filterByYear = filterByYear;
const filterByGenre = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { genre } = req.body;
            const series = yield series_1.default.find({
                genres: { $in: genre },
            }).lean();
            if (!series || series.length === 0) {
                return res.status(400).json({ msg: "Movies not found" });
            }
            return res.status(200).json(series);
        }
        catch (err) {
            return res.status(400).json(err);
        }
    });
};
exports.filterByGenre = filterByGenre;
const newestFirst = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const series = yield series_1.default.find().sort({ firstAirDate: -1 }).lean();
            if (!series || series.length === 0) {
                return res.status(400).json({ msg: "Movies not found" });
            }
            return res.status(200).json(series);
        }
        catch (err) {
            return res.status(400).json(err);
        }
    });
};
exports.newestFirst = newestFirst;
const oldestFirst = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const series = yield series_1.default.find().sort({ firstAirDate: 1 }).lean();
            if (!series || series.length === 0) {
                return res.status(400).json({ msg: "Movies not found" });
            }
            return res.status(200).json(series);
        }
        catch (err) {
            return res.status(400).json(err);
        }
    });
};
exports.oldestFirst = oldestFirst;
