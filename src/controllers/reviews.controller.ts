import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import MOVIES, { IMovie } from "../models/movies";
import SERIES, { ISerie } from "../models/series";
import REVIEWS, { IReview } from "../models/reviews";
import USERS, { IUser } from "../models/users";

export const movieUtil = async function (movie: IMovie) {
  const publicUtil = await REVIEWS.find({
    mediaTitle: movie.title,
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
    mediaTitle: movie.title,
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

export const serieUtil = async function (serie: ISerie) {
  const publicUtil = await REVIEWS.find({
    mediaTitle: serie.title,
    type: "public",
  }).lean();

  // console.log(publicUtil);

  if (!publicUtil || publicUtil.length === 0) {
    serie.publicRatings = 0;
  } else {
    const publicCount = publicUtil.length;
    const totalPublic = publicUtil.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    serie.publicRatings = totalPublic / publicCount;
  }

  const criticUtil = await REVIEWS.find({
    mediaTitle: serie.title,
    type: "critic",
  }).lean();

  if (!criticUtil || criticUtil.length === 0) {
    serie.criticsRatings = 0;
  } else {
    const criticCount = criticUtil.length;
    const totalCritic = criticUtil.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    serie.criticsRatings = totalCritic / criticCount;
  }

  await serie.save();
};

export const createReview = async function (req: Request, res: Response) {
  const { owner } = req.params;
  const { mediaTitle, description, rating } = req.body;

  if (!mediaTitle || !owner || !description || !rating) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const verify = await REVIEWS.findOne({
    owner: owner,
    mediaTitle: mediaTitle,
  });

  if (verify) {
    return res.status(400).json({
      message: "Review already exists",
    });
  }

  try {
    const movie = await MOVIES.findOne({
      title: mediaTitle,
    });
    const serie = await SERIES.findOne({
      title: mediaTitle,
    });
    const user = await USERS.findOne({
      alias: owner,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (movie) {
      const newReview = new REVIEWS({
        mediaTitle: mediaTitle,
        description: description,
        rating: rating,
        owner: owner,
        type: user.type,
      });
      await newReview.save();
      await movieUtil(movie);
      return res.status(201).json({ msg: "Review created" });
    }

    if (serie) {
      const newReview = new REVIEWS({
        mediaTitle: mediaTitle,
        description: description,
        rating: rating,
        owner: owner,
        type: user.type,
      });
      await newReview.save();
      await serieUtil(serie);
      return res.status(201).json({ msg: "Review created" });
    }

    return res.status(400).json({
      message: "Media not found",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const editReview = async function (req: Request, res: Response) {
  const { owner } = req.params;
  const { mediaTitle, description, rating } = req.body;

  try {
    if (!mediaTitle || !owner || !description || !rating) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const movie = await MOVIES.findOne({
      title: mediaTitle,
    });
    const serie = await SERIES.findOne({
      title: mediaTitle,
    });
    const review = await REVIEWS.findOne({
      owner: owner,
      mediaTitle: mediaTitle,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }
    if (movie) {
      review.description = description;
      review.rating = rating;

      await review.save();
      await movieUtil(movie);
      return res.status(400).json({
        message: "Review updated",
      });
    }

    if (serie) {
      review.description = description;
      review.rating = rating;

      await review.save();
      await serieUtil(serie);
      return res.status(400).json({
        message: "Review updated",
      });
    }

    return res.status(400).json({
      message: "Media not found",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteReview = async function (req: Request, res: Response) {
  const { owner } = req.params;
  const { mediaTitle } = req.body;

  try {
    if (!mediaTitle || !owner) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const movie = await MOVIES.findOne({
      title: mediaTitle,
    });
    const serie = await SERIES.findOne({
      title: mediaTitle,
    });
    const review = await REVIEWS.findOne({
      owner: owner,
      mediaTitle: mediaTitle,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (movie) {
      await REVIEWS.deleteOne({
        owner: owner,
        mediaTitle: mediaTitle,
      });
      await movieUtil(movie);

      return res.status(200).json({ msg: "Review deleted" });
    }

    if (serie) {
      await REVIEWS.deleteOne({
        owner: owner,
        mediaTitle: mediaTitle,
      });
      await serieUtil(serie);

      return res.status(200).json({ msg: "Review deleted" });
    }

    return res.status(400).json({
      message: "Media not found",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};
