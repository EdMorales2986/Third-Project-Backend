import mongoose from "mongoose";

interface IMessage {
  roomId: string;
  message: string;
  sender: string;
}

export interface IChat extends mongoose.Document {
  roomId: string;
  messages: string[];
  participant1: string;
  participant2: string;
  type: string;
}

const messageSchema = new mongoose.Schema<IMessage>({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
});

const chatSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  messages: {
    type: [messageSchema],
    required: true,
  },
  participant1: {
    type: String,
  },
  participant2: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    enum: ["private", "public"],
  },
});

export default mongoose.model<IChat>("CHATS", chatSchema);
