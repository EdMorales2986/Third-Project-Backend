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
exports.filterByGenre = exports.filterByYear = exports.searchMovie = void 0;
const movies_1 = __importDefault(require("../models/movies"));
const moviedb_promise_1 = require("moviedb-promise");
const TMDB = new moviedb_promise_1.MovieDb(`${process.env.APIKEY}`);
const createEntries = function (movies) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        for (const movie of movies) {
            const movieInfo = yield TMDB.movieInfo({
                id: `${movie.id}`,
                language: "en",
            });
            if (!movieInfo.release_date ||
                !movieInfo.overview ||
                movieInfo.status !== "Released") {
                continue;
            }
            const entry = new movies_1.default({
                title: movieInfo.title,
                posterURL: `https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`,
                genres: (_a = movieInfo.genres) === null || _a === void 0 ? void 0 : _a.map((genre) => genre.name),
                overview: movieInfo.overview,
                releaseDate: movieInfo.release_date,
                trailerURL: ``,
                duration: movieInfo.runtime,
            });
            const videos = yield TMDB.movieVideos({
                id: `${movie.id}`,
                language: "en",
            }).then((data) => {
                var _a;
                const trailer = (_a = data.results) === null || _a === void 0 ? void 0 : _a.find((element) => element.type === "Trailer");
                entry.trailerURL = `https://www.youtube.com/watch?v=${trailer === null || trailer === void 0 ? void 0 : trailer.key}`;
            });
            yield entry.save();
        }
    });
};
// export const getTrendingMovies = async function (req: Request, res: Response) {
//   try {
//     const trending = await TMDB.trending({
//       media_type: "movie",
//       time_window: "week",
//     });
//     const movies = trending.results as MovieResult[];
//     await createEntries(movies);
//     return res.sendStatus(200);
//   } catch (err) {
//     return res.status(400).json(err);
//   }
// };
const searchMovie = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { query } = req.body;
            const movies = yield movies_1.default.find({
                title: { $regex: `${query}`, $options: "i" },
            }).lean();
            if (!movies || movies.length === 0) {
                const movieQuery = yield TMDB.searchMovie({
                    query: `${query}`,
                    language: "en",
                });
                if (!movieQuery) {
                    return res.status(400).json({ msg: "Movie not found" });
                }
                const movies = movieQuery.results;
                yield createEntries(movies);
                const response = yield movies_1.default.find({
                    title: { $regex: `${query}`, $options: "i" },
                }).lean();
                if (!response || response.length === 0) {
                    return res.status(400).json({ msg: "Movie not found" });
                }
                return res.status(200).json(response);
            }
            return res.status(200).json(movies);
        }
        catch (err) {
            return res.status(400).json(err);
        }
    });
};
exports.searchMovie = searchMovie;
const filterByYear = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { startDate, endDate } = req.params;
            const movies = yield movies_1.default.find({
                releaseDate: {
                    $gte: startDate,
                    $lte: endDate,
                },
            }).lean();
            if (!movies || movies.length === 0) {
                return res.status(400).json({ msg: "Movies not found" });
            }
            return res.status(200).json(movies);
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
            const { genre } = req.params;
            const movies = yield movies_1.default.find({
                genres: { $in: `${genre}` },
            }).lean();
            if (!movies || movies.length === 0) {
                return res.status(400).json({ msg: "Movies not found" });
            }
            return res.status(200).json(movies);
        }
        catch (err) {
            return res.status(400).json(err);
        }
    });
};
exports.filterByGenre = filterByGenre;
