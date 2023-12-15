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
exports.searchUser = exports.updatePassword = exports.updateEmail = exports.updateName = exports.deleteUser = exports.signIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = __importDefault(require("../models/users"));
const reviews_1 = __importDefault(require("../models/reviews"));
const movies_1 = __importDefault(require("../models/movies"));
const reviews_controller_1 = require("./reviews.controller");
function createToken(user) {
    return jsonwebtoken_1.default.sign({ alias: user.alias, password: user.password }, `${process.env.JWTSECRET}`, { expiresIn: "7d" });
}
function validateEmail(email) {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
}
const signUp = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { password, email, name, alias } = req.body;
        if (!password || !email || !name || !alias) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        const userAlias = yield users_1.default.findOne({ alias });
        const userEmail = yield users_1.default.findOne({ email });
        if (userAlias || userEmail) {
            return res
                .status(400)
                .json({ msg: "The user/email is already registered" });
        }
        else if (password.length < 8) {
            return res
                .status(400)
                .json({ msg: "The password must be at least 8 characters" });
        }
        else if (password.length > 16) {
            return res
                .status(400)
                .json({ msg: "The password must be less than 16 characters" });
        }
        else if (!validateEmail(email)) {
            return res.status(400).json({ msg: "The email is not valid" });
        }
        const newUser = new users_1.default(req.body);
        try {
            yield newUser.save();
            // console.log("user saved");
            return res.status(200).json({ msg: "User created" });
        }
        catch (err) {
            return res.status(400).json(err);
        }
    });
};
exports.signUp = signUp;
const signIn = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { alias, password } = req.body; //e.g. "ED_123" "bruh12345"
        const user = yield users_1.default.findOne({ alias });
        if (!alias || !password) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Wrong Password" });
        }
        const token = createToken(user);
        return res.json({ jwt: token, user });
    });
};
exports.signIn = signIn;
const deleteUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user, password } = req.params; //e.g. "ED_123"
        const foundUser = yield users_1.default.findOne({ alias: user });
        if (!password) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        else if (!foundUser) {
            return res.status(400).json({ msg: "User not found" });
        }
        const isMatch = yield foundUser.comparePassword(password);
        if (foundUser && isMatch) {
            yield users_1.default.deleteOne({ alias: user });
            const reviews = yield reviews_1.default.find({ owner: user });
            for (const review of reviews) {
                yield reviews_1.default.deleteOne({ _id: review._id });
                const movie = yield movies_1.default.findOne({ title: review.movieTitle });
                if (movie) {
                    yield (0, reviews_controller_1.movieUtil)(movie);
                }
            }
            return res.status(200).json({ msg: "User deleted" });
        }
        return res
            .status(400)
            .json({ msg: "Encountered an error during this process" });
    });
};
exports.deleteUser = deleteUser;
const updateName = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user } = req.params;
        const { name, oldPass } = req.body;
        const foundUser = yield users_1.default.findOne({ alias: user });
        if (!foundUser) {
            return res.status(400).json({ msg: "User not found" });
        }
        const isMatch = yield foundUser.comparePassword(oldPass);
        if (isMatch) {
            foundUser.name = name;
            yield foundUser.save();
            return res.status(200).json({ msg: "Name updated" });
        }
        return res
            .status(400)
            .json({ msg: "Encountered an error during this process" });
    });
};
exports.updateName = updateName;
const updateEmail = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user } = req.params;
        const { email, oldPass } = req.body;
        const foundUser = yield users_1.default.findOne({ alias: user });
        if (!foundUser) {
            return res.status(400).json({ msg: "User not found" });
        }
        const userEmail = yield users_1.default.findOne({ email: email });
        if (userEmail) {
            return res
                .status(400)
                .json({ msg: "The user/email is already registered" });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ msg: "The email is not valid" });
        }
        const isMatch = yield foundUser.comparePassword(oldPass);
        if (isMatch) {
            foundUser.email = email;
            yield foundUser.save();
            return res.status(200).json({ msg: "Email updated" });
        }
        return res
            .status(400)
            .json({ msg: "Encountered an error during this process" });
    });
};
exports.updateEmail = updateEmail;
//   const { user } = req.params;
//   const { profilePic } = req.body;
//   const foundUser = await USERS.findOne({ alias: user });
//   if (!foundUser) {
//     return res.status(400).json({ msg: "User not found" });
//   }
//   foundUser.profilePic = profilePic;
//   await foundUser.save();
//   return res.status(200).json({ msg: "Profile picture updated" });
// };
const updatePassword = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user } = req.params;
        const { newPass, oldPass } = req.body;
        const foundUser = yield users_1.default.findOne({ alias: user });
        if (!foundUser) {
            return res.status(400).json({ msg: "User not found" });
        }
        const isMatch = yield foundUser.comparePassword(oldPass);
        if (isMatch) {
            foundUser.password = newPass;
            yield foundUser.save();
            return res.status(200).json({ msg: "Password updated" });
        }
        return res
            .status(400)
            .json({ msg: "Encountered an error during this process" });
    });
};
exports.updatePassword = updatePassword;
const searchUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { query } = req.body;
        try {
            const user = yield users_1.default.find({
                alias: { $regex: query, $options: "i" },
            });
            // const test = user[0].get("lastName");
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(400).json({ msg: "User not found" });
        }
    });
};
exports.searchUser = searchUser;
