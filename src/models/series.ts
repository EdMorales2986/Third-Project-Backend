import mongoose from "mongoose";

export interface ISerie extends mongoose.Document {
  title: string;
  posterURL: string;
  genres: string[];
  overview: string;
  firstAirDate: string;
  lastAirDate: string;
  trailerURL: string;
  seasons: string[];
  publicRatings: number;
  criticsRatings: number;
}

interface ISeason {
  number: number;
  name: string;
  episodes: number;
  airdate: string;
}

const seasonSchema = new mongoose.Schema<ISeason>({
  number: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  episodes: {
    type: Number,
    required: true,
  },
  airdate: {
    type: String,
    required: true,
  },
});

const serieSchema = new mongoose.Schema({
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
  firstAirDate: {
    type: String,
    required: true,
  },
  lastAirDate: {
    type: String,
    required: true,
  },
  trailerURL: {
    type: String,
    required: true,
  },
  seasons: {
    type: [seasonSchema],
    required: true,
  },
  publicRatings: {
    type: Number,
    default: 0,
  },
  criticsRatings: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model<ISerie>("SERIES", serieSchema);
