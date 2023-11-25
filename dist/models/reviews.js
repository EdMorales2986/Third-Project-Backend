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
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("./users"));
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
        min: 0,
        max: 5,
        required: true,
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
}, {
    timestamps: true,
});
reviewSchema.virtual("ownerType").get(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield users_1.default
                .findOne({ alias: this.owner })
                .lean();
            if (!user) {
                return null;
            }
            return user.type;
        }
        catch (error) {
            console.log(error);
        }
    });
});
exports.default = mongoose_1.default.model("review", reviewSchema);
