import mongoose from "mongoose";
import users, { IUser } from "./users";

export interface IReview extends mongoose.Document {
  movieTitle: string;
  description: string;
  rating: number;
  owner: string;
}

const reviewSchema = new mongoose.Schema(
  {
    movieTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.virtual("ownerType").get(async function () {
  try {
    const user: IUser | null = await users
      .findOne({ alias: this.owner })
      .lean();
    if (!user) {
      return null;
    }
    return user.type;
  } catch (error) {
    console.log(error);
  }
});

export default mongoose.model<IReview>("reviews", reviewSchema);
