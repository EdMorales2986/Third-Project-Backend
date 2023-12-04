"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    movieTitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["public", "critic"],
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("REVIEWS", reviewSchema);
