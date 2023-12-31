"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
});
const chatSchema = new mongoose_1.default.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    messages: {
        type: [messageSchema],
        required: true,
    },
    participants: {
        type: [String],
    },
    type: {
        type: String,
        required: true,
        enum: ["private", "public"],
    },
});
exports.default = mongoose_1.default.model("CHATS", chatSchema);
