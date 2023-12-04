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
exports.deleteReview = exports.editReview = exports.createReview = exports.movieUtil = void 0;
const movies_1 = __importDefault(require("../models/movies"));
const reviews_1 = __importDefault(require("../models/reviews"));
const users_1 = __importDefault(require("../models/users"));
const movieUtil = function (movie) {
    return __awaiter(this, void 0, void 0, function* () {
        const publicUtil = yield reviews_1.default.find({
            movieTitle: movie.title,
            type: "public",
        }).lean();
        if (!publicUtil || publicUtil.length === 0) {
            movie.publicRatings = 0;
        }
        else {
            const publicCount = publicUtil.length;
            const totalPublic = publicUtil.reduce((sum, review) => sum + review.rating, 0);
            movie.publicRatings = totalPublic / publicCount;
        }
        const criticUtil = yield reviews_1.default.find({
            movieTitle: movie.title,
            type: "critic",
        }).lean();
        if (!criticUtil || criticUtil.length === 0) {
            movie.criticsRatings = 0;
        }
        else {
            const criticCount = criticUtil.length;
            const totalCritic = criticUtil.reduce((sum, review) => sum + review.rating, 0);
            movie.criticsRatings = totalCritic / criticCount;
        }
        yield movie.save();
    });
};
exports.movieUtil = movieUtil;
const createReview = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { owner } = req.params;
        const { movieTitle, description, rating } = req.body;
        const verify = yield reviews_1.default.findOne({
            owner: owner,
            movieTitle: movieTitle,
        });
        if (verify) {
            return res.status(400).json({
                message: "Review already exists",
            });
        }
        try {
            if (!movieTitle || !owner || !description || !rating) {
                return res.status(400).json({
                    message: "All fields are required",
                });
            }
            const movie = yield movies_1.default.findOne({
                title: movieTitle,
            });
            const user = yield users_1.default.findOne({
                alias: owner,
            });
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            if (!movie) {
                return res.status(404).json({
                    message: "Movie not found",
                });
            }
            const newReview = new reviews_1.default({
                movieTitle: movieTitle,
                description: description,
                rating: rating,
                owner: owner,
                type: user.type,
            });
            yield newReview.save();
            yield (0, exports.movieUtil)(movie);
            return res.status(201).json({ msg: "Review created" });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    });
};
exports.createReview = createReview;
const editReview = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { owner } = req.params;
        const { movieTitle, description, rating } = req.body;
        try {
            if (!movieTitle || !owner || !description || !rating) {
                return res.status(400).json({
                    message: "All fields are required",
                });
            }
            const movie = yield movies_1.default.findOne({
                title: movieTitle,
            });
            const review = yield reviews_1.default.findOne({
                owner: owner,
                movieTitle: movieTitle,
            });
            if (!review) {
                return res.status(404).json({
                    message: "Review not found",
                });
            }
            if (!movie) {
                return res.status(404).json({
                    message: "Movie not found",
                });
            }
            review.description = description;
            review.rating = rating;
            yield review.save();
            yield (0, exports.movieUtil)(movie);
            return res.status(200).json({ msg: "Review updated" });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    });
};
exports.editReview = editReview;
const deleteReview = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { owner } = req.params;
        const { movieTitle } = req.body;
        try {
            if (!movieTitle || !owner) {
                return res.status(400).json({
                    message: "All fields are required",
                });
            }
            const movie = yield movies_1.default.findOne({
                title: movieTitle,
            });
            const review = yield reviews_1.default.findOne({
                owner: owner,
                movieTitle: movieTitle,
            });
            if (!review) {
                return res.status(404).json({
                    message: "Review not found",
                });
            }
            if (!movie) {
                return res.status(404).json({
                    message: "Movie not found",
                });
            }
            yield reviews_1.default.deleteOne({
                owner: owner,
                movieTitle: movieTitle,
            });
            yield (0, exports.movieUtil)(movie);
            return res.status(200).json({ msg: "Review deleted" });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    });
};
exports.deleteReview = deleteReview;
