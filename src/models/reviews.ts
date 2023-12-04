import mongoose from "mongoose";
import users, { IUser } from "./users";
import movies, { IMovie } from "./movies";

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

reviewSchema.post<IReview>("save", async function () {
  try {
    const movie: IMovie | null = await movies
      .findOne({ title: this.movieTitle })
      .lean();
    if (!movie) {
      return;
    }

    const type = await this.get("ownerType");
    switch (type) {
      case "public":
        {
          movie.publicCount++;
          await movie.save();
        }
        break;

      case "critic":
        {
          movie.criticsCount++;
          await movie.save();
        }
        break;

      default:
        console.log(type);
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

export default mongoose.model<IReview>("REVIEWS", reviewSchema);
