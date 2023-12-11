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
exports.sendMessage = exports.getMessages = exports.getPrivateChats = exports.getPublicChats = exports.privateChats = void 0;
const chats_1 = __importDefault(require("../../models/CHAT/chats"));
const privateChats = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { roomId, participants } = req.body;
        if (!roomId) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        try {
            const chat = yield chats_1.default.findOne({
                participants: { $all: participants },
            });
            if (chat) {
                return res
                    .status(200)
                    .json({ msg: "Chat already exists", roomId: chat.roomId });
            }
            const newChat = new chats_1.default({
                roomId: roomId,
                messages: [],
                participants: participants,
                type: "private",
            });
            yield newChat.save();
            return res
                .status(200)
                .json({ msg: "Chat created", roomId: newChat.roomId });
        }
        catch (error) {
            return res.status(500).json({ msg: "Error creating chat" });
        }
    });
};
exports.privateChats = privateChats;
const getPublicChats = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield chats_1.default.find({ type: "public" });
        return res.status(200).json(response);
    });
};
exports.getPublicChats = getPublicChats;
const getPrivateChats = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield chats_1.default.find({ type: "private" });
        return res.status(200).json(response);
    });
};
exports.getPrivateChats = getPrivateChats;
const getMessages = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { roomId } = req.params;
        if (!roomId) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        const response = yield chats_1.default.findOne({ roomId: roomId });
        if (!response) {
            return res.status(400).json({ msg: "Chat not found" });
        }
        return res.status(200).json({
            messages: response.messages,
        });
    });
};
exports.getMessages = getMessages;
const sendMessage = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { roomId, message } = req.body;
        if (!roomId || !message) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        const response = yield chats_1.default.findOne({ roomId: roomId });
        if (!response) {
            return res.status(400).json({ msg: "Chat not found" });
        }
        response.messages.push(message);
        yield response.save();
        return res.status(200).json({
            messages: response.messages,
        });
    });
};
exports.sendMessage = sendMessage;
