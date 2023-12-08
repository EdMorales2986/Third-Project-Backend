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
exports.getComments = exports.updateComment = exports.deleteComment = exports.createComment = void 0;
const comments_1 = __importDefault(require("../models/comments"));
const users_1 = __importDefault(require("../models/users"));
const reviews_1 = __importDefault(require("../models/reviews"));
const createComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { owner, origin, desc } = req.body;
        if (!owner || !origin || !desc) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        const newComment = new comments_1.default(req.body);
        try {
            const user = yield users_1.default.findOne({ alias: owner });
            const review = yield reviews_1.default.findOne({ _id: origin });
            const comment = yield comments_1.default.findOne({ _id: origin });
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }
            if (!review && !comment) {
                return res.status(404).json({ msg: "Origin not found" });
            }
            yield newComment.save();
            return res.status(201).json({ msg: "Comment created" });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    });
};
exports.createComment = createComment;
const deleteComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { owner, id } = req.params;
        if (!owner || !id) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        try {
            const comment = yield comments_1.default.findOne({ _id: id, owner: owner });
            if ((comment === null || comment === void 0 ? void 0 : comment.owner) !== owner || !comment) {
                return res
                    .status(400)
                    .json({ msg: "You are not the owner of this comment" });
            }
            yield comments_1.default.deleteOne({ _id: id });
            yield comments_1.default.deleteMany({ origin: id });
            return res.status(200).json({ msg: "Comment deleted" });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    });
};
exports.deleteComment = deleteComment;
const updateComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { owner, id, desc } = req.body;
        if (!owner || !id || !desc) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        try {
            const comment = yield comments_1.default.findOne({ _id: id });
            if ((comment === null || comment === void 0 ? void 0 : comment.owner) !== owner || !comment) {
                return res
                    .status(400)
                    .json({ msg: "You are not the owner of this comment" });
            }
            comment.desc = desc;
            yield comment.save();
            return res.status(200).json({ msg: "Comment updated" });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    });
};
exports.updateComment = updateComment;
const getComments = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { origin } = req.params;
        if (!origin) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        try {
            const comments = yield comments_1.default.find({ origin: origin });
            return res.status(200).json(comments);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    });
};
exports.getComments = getComments;
