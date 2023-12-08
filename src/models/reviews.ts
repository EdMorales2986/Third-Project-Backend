import mongoose from "mongoose";
import USERS, { IUser } from "./users";
import MOVIES, { IMovie } from "./movies";

export interface IReview extends mongoose.Document {
  movieTitle: string;
  description: string;
  rating: number;
  owner: string;
}

const reviewSchema = new mongoose.Schema(
  {
    mediaTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["public", "critic"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReview>("REVIEWS", reviewSchema);
