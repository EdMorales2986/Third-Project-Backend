import { Request, Response, NextFunction } from "express";
import COMMENTS, { IComment } from "../models/comments";
import USERS, { IUser } from "../models/users";
import REVIEWS, { IReview } from "../models/reviews";

export const createComment = async function (req: Request, res: Response) {
  const { owner, origin, desc } = req.body;
  if (!owner || !origin || !desc) {
    return res.status(400).json({ msg: "Please send valid data" });
  }

  const newComment = new COMMENTS(req.body);
  try {
    const user = await USERS.findOne({ alias: owner });
    const review = await REVIEWS.findOne({ _id: origin });
    const comment = await COMMENTS.findOne({ _id: origin });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!review && !comment) {
      return res.status(404).json({ msg: "Origin not found" });
    }

    await newComment.save();
    return res.status(201).json({ msg: "Comment created" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteComment = async function (req: Request, res: Response) {
  const { owner, id } = req.params;

  if (!owner || !id) {
    return res.status(400).json({ msg: "Please send valid data" });
  }
  try {
    const comment = await COMMENTS.findOne({ _id: id });
    if (comment?.owner !== owner || !comment) {
      return res
        .status(400)
        .json({ msg: "You are not the owner of this comment" });
    }

    await COMMENTS.deleteOne({ _id: id });
    await COMMENTS.deleteMany({ origin: id });
    return res.status(200).json({ msg: "Comment deleted" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const updateComment = async function (req: Request, res: Response) {
  const { owner, id, desc } = req.body;
  if (!owner || !id || !desc) {
    return res.status(400).json({ msg: "Please send valid data" });
  }
  try {
    const comment = await COMMENTS.findOne({ _id: id });
    if (comment?.owner !== owner || !comment) {
      return res
        .status(400)
        .json({ msg: "You are not the owner of this comment" });
    }

    comment.desc = desc;
    await comment.save();
    return res.status(200).json({ msg: "Comment updated" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getComments = async function (req: Request, res: Response) {
  const { origin } = req.params;
  if (!origin) {
    return res.status(400).json({ msg: "Please send valid data" });
  }
  try {
    const comments = await COMMENTS.find({ origin: origin });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json(err);
  }
};
