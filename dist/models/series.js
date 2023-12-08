"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const seasonSchema = new mongoose_1.default.Schema({
    number: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    episodes: {
        type: Number,
        required: true,
    },
    airdate: {
        type: String,
        required: true,
    },
});
const serieSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    posterURL: {
        type: String,
        required: true,
    },
    genres: {
        type: [String],
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    firstAirDate: {
        type: String,
        required: true,
    },
    lastAirDate: {
        type: String,
        required: true,
    },
    trailerURL: {
        type: String,
        required: true,
    },
    seasons: {
        type: [seasonSchema],
        required: true,
    },
    publicRatings: {
        type: Number,
        default: 0,
    },
    criticsRatings: {
        type: Number,
        default: 0,
    },
});
exports.default = mongoose_1.default.model("SERIES", serieSchema);
