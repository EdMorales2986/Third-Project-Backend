import { Request, Response, NextFunction } from "express";
import USERS, { IUser } from "../../models/users";
import CHATS, { IChat } from "../../models/CHAT/chats";

export const createChat = async function (req: Request, res: Response) {
  const { roomId, participant1, participant2 } = req.body;

  if (!roomId) {
    return res.status(400).json({ msg: "Please send valid data" });
  }
};

export const getPublicChats = async function (req: Request, res: Response) {
  const response = await CHATS.find({ type: "public" });
  return res.status(200).json(response);
};

export const getPrivateChats = async function (req: Request, res: Response) {
  const response = await CHATS.find({ type: "private" });
  return res.status(200).json(response);
};

export const getMessages = async function (req: Request, res: Response) {
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ msg: "Please send valid data" });
  }

  const response = await CHATS.findOne({ roomId: roomId });

  if (!response) {
    return res.status(400).json({ msg: "Chat not found" });
  }

  return res.status(200).json({
    messages: response.messages,
  });
};

export const sendMessage = async function (req: Request, res: Response) {
  const { roomId, message } = req.body;

  if (!roomId || !message) {
    return res.status(400).json({ msg: "Please send valid data" });
  }

  const response = await CHATS.findOne({ roomId: roomId });

  if (!response) {
    return res.status(400).json({ msg: "Chat not found" });
  }

  response.messages.push(message);
  await response.save();

  return res.status(200).json({
    messages: response.messages,
  });
};
