import mongoose from "mongoose";
import REVIEWS, { IReview } from "../models/reviews";

export interface IMovie extends mongoose.Document {
  title: string;
  posterURL: string;
  genres: string[];
  overview: string;
  releaseDate: string;
  trailerURL: string;
  duration: number;
  publicRatings: number;
  publicCount: number;
  criticsRatings: number;
  criticsCount: number;
  status: string;
}

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  posterURL: {
    type: String,
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  trailerURL: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  publicRatings: {
    type: Number,
    default: 0,
  },
  publicCount: {
    type: Number,
    default: 0,
  },
  criticsRatings: {
    type: Number,
    default: 0,
  },
  criticsCount: {
    type: Number,
    default: 0,
  },
  // status: {
  //   type: String,
  //   enum: ["Released"],
  //   required: true,
  // },
});

export default mongoose.model<IMovie>("MOVIES", movieSchema);
