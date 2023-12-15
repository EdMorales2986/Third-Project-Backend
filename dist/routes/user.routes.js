"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post("/jwt-verify", passport_1.default.authenticate("jwt", { session: false }), (req, res) => {
    res.json({ state: true });
});
router.post("/signup", user_controllers_1.signUp);
router.post("/signin", user_controllers_1.signIn);
router.delete("/:user/:password", user_controllers_1.deleteUser); // user must be like PIPO123
router.put("/:user/updateName", user_controllers_1.updateName);
router.put("/:user/updateEmail", user_controllers_1.updateEmail);
router.put("/:user/updatePassword", user_controllers_1.updatePassword);
router.post("/search", user_controllers_1.searchUser);
exports.default = router;
