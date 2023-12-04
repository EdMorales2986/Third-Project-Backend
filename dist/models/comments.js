"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    owner: {
        type: String,
        require: true,
        trim: true,
    },
    origin: {
        type: String,
        require: true,
        trim: true,
    },
    desc: {
        type: String,
        require: true,
        trim: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("COMMENTS", CommentSchema);
