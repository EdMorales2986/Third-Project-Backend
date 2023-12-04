import mongoose from "mongoose";

export interface IMessage extends mongoose.Document {}

const messageSchema = new mongoose.Schema({});

export default mongoose.model<IMessage>("MESSAGES", messageSchema);
