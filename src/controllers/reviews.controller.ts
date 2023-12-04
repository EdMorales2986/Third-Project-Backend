import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import MOVIES, { IMovie } from "../models/movies";
import REVIEWS, { IReview } from "../models/reviews";
import USERS, { IUser } from "../models/users";

export const movieUtil = async function (movie: IMovie) {
  const publicUtil = await REVIEWS.find({
    movieTitle: movie.title,
    type: "public",
  }).lean();

  if (!publicUtil || publicUtil.length === 0) {
    movie.publicRatings = 0;
  } else {
    const publicCount = publicUtil.length;
    const totalPublic = publicUtil.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    movie.publicRatings = totalPublic / publicCount;
  }

  const criticUtil = await REVIEWS.find({
    movieTitle: movie.title,
    type: "critic",
  }).lean();

  if (!criticUtil || criticUtil.length === 0) {
    movie.criticsRatings = 0;
  } else {
    const criticCount = criticUtil.length;
    const totalCritic = criticUtil.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    movie.criticsRatings = totalCritic / criticCount;
  }

  await movie.save();
};

export const createReview = async function (req: Request, res: Response) {
  const { owner } = req.params;
  const { movieTitle, description, rating } = req.body;

  const verify = await REVIEWS.findOne({
    owner: owner,
    movieTitle: movieTitle,
  });

  if (verify) {
    return res.status(400).json({
      message: "Review already exists",
    });
  }

  try {
    if (!movieTitle || !owner || !description || !rating) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const movie = await MOVIES.findOne({
      title: movieTitle,
    });
    const user = await USERS.findOne({
      alias: owner,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    const newReview = new REVIEWS({
      movieTitle: movieTitle,
      description: description,
      rating: rating,
      owner: owner,
      type: user.type,
    });

    await newReview.save();
    await movieUtil(movie);

    return res.status(201).json({ msg: "Review created" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const editReview = async function (req: Request, res: Response) {
  const { owner } = req.params;
  const { movieTitle, description, rating } = req.body;

  try {
    if (!movieTitle || !owner || !description || !rating) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const movie = await MOVIES.findOne({
      title: movieTitle,
    });
    const review = await REVIEWS.findOne({
      owner: owner,
      movieTitle: movieTitle,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }
    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    review.description = description;
    review.rating = rating;

    await review.save();
    await movieUtil(movie);

    return res.status(200).json({ msg: "Review updated" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteReview = async function (req: Request, res: Response) {
  const { owner } = req.params;
  const { movieTitle } = req.body;

  try {
    if (!movieTitle || !owner) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const movie = await MOVIES.findOne({
      title: movieTitle,
    });
    const review = await REVIEWS.findOne({
      owner: owner,
      movieTitle: movieTitle,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }
    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    await REVIEWS.deleteOne({
      owner: owner,
      movieTitle: movieTitle,
    });
    await movieUtil(movie);

    return res.status(200).json({ msg: "Review deleted" });
  } catch (err) {
    return res.status(500).json(err);
  }
};
