"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const movieSchema = new mongoose_1.default.Schema({
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
    releaseDate: {
        type: String,
        required: true,
    },
    trailerURL: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    publicRatings: {
        type: Number,
        default: 0,
    },
    publicCount: {
        type: Number,
        default: 0,
    },
    criticsRatings: {
        type: Number,
        default: 0,
    },
    criticsCount: {
        type: Number,
        default: 0,
    },
    // status: {
    //   type: String,
    //   enum: ["Released"],
    //   required: true,
    // },
});
exports.default = mongoose_1.default.model("MOVIES", movieSchema);
