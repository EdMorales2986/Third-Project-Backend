import mongoose from "mongoose";

export interface IChat extends mongoose.Document {}

const chatSchema = new mongoose.Schema({});

export default mongoose.model<IChat>("CHATS", chatSchema);
