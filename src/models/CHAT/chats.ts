import mongoose from "mongoose";

interface IMessage {
  message: string;
  sender: string;
}

export interface IChat extends mongoose.Document {
  roomId: string;
  messages: string[];
  participants: string[];
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
    unique: true,
  },
  messages: {
    type: [messageSchema],
    required: true,
  },
  participants: {
    type: [String],
  },
  type: {
    type: String,
    required: true,
    enum: ["private", "public"],
  },
});

export default mongoose.model<IChat>("CHATS", chatSchema);
