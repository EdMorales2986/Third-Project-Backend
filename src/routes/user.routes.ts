import { Router } from "express";
import {
  signIn,
  signUp,
  deleteUser,
  updateName,
  updateEmail,
  updatePassword,
  searchUser,
} from "../controllers/user.controllers";
import passport from "passport";

const router = Router();

router.post(
  "/jwt-verify",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ state: true });
  }
);

router.post("/signup", signUp);
router.post("/signin", signIn);
router.delete("/:user/delete", deleteUser);
router.put("/:user/updateName", updateName);
router.put("/:user/updateEmail", updateEmail);
router.put("/:user/updatePassword", updatePassword);
router.post("/search", searchUser);

export default router;
