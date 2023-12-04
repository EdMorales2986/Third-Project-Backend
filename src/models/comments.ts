import mongoose from "mongoose";

export interface IComment extends mongoose.Document {
  owner: string;
  origin: string;
  desc: string;
}

const CommentSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      require: true,
      trim: true,
    },
    origin: {
      type: String,
      require: true,
      trim: true,
    },
    desc: {
      type: String,
      require: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IComment>("COMMENTS", CommentSchema);
