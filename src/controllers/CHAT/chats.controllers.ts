import { Request, Response, NextFunction } from "express";
import USERS, { IUser } from "../../models/users";
import CHATS, { IChat } from "../../models/CHAT/chats";

export const privateChats = async function (req: Request, res: Response) {
  const { roomId, participants } = req.body;

  if (!roomId) {
    return res.status(400).json({ msg: "Please send valid data" });
  }

  try {
    const chat = await CHATS.findOne({
      participants: { $all: participants },
    });
    if (chat) {
      return res
        .status(200)
        .json({ msg: "Chat already exists", roomId: chat.roomId });
    }

    const newChat = new CHATS({
      roomId: roomId,
      messages: [],
      participants: participants,
      type: "private",
    });

    await newChat.save();

    return res
      .status(200)
      .json({ msg: "Chat created", roomId: newChat.roomId });
  } catch (error) {
    return res.status(500).json({ msg: "Error creating chat" });
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
  const { roomId } = req.params;

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
