import { Request, Response, NextFunction } from "express";
import MOVIES, { IMovie } from "../models/movies";
import { MovieDb, MovieResult } from "moviedb-promise";

const TMDB = new MovieDb(`${process.env.APIKEY}`);

const createEntries = async function (movies: MovieResult[]) {
  for (const movie of movies) {
    const movieInfo = await TMDB.movieInfo({
      id: `${movie.id}`,
      language: "en",
    });

    if (
      !movieInfo.release_date ||
      !movieInfo.overview ||
      movieInfo.status !== "Released" ||
      (movieInfo.original_language !== "en" &&
        movieInfo.original_language !== "es")
    ) {
      continue;
    }

    const entry = new MOVIES({
      title: movieInfo.title,
      posterURL: `https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`,
      genres: movieInfo.genres?.map((genre: any) => genre.name),
      overview: movieInfo.overview,
      releaseDate: movieInfo.release_date,
      trailerURL: ``,
      duration: movieInfo.runtime,
    });

    const videos = await TMDB.movieVideos({
      id: `${movie.id}`,
      language: "en",
    }).then((data) => {
      const trailer = data.results?.find(
        (element: any) => element.type === "Trailer"
      );
      if (!trailer) {
        entry.trailerURL = "not available";
      } else {
        entry.trailerURL = `https://www.youtube.com/watch?v=${trailer?.key}`;
      }
    });
    await entry.save();
  }
};

// export const getTrendingMovies = async function (req: Request, res: Response) {
//   try {
//     const trending = await TMDB.trending({
//       media_type: "movie",
//       time_window: "week",
//     });

//     const movies = trending.results as MovieResult[];
//     await createEntries(movies);

//     return res.sendStatus(200);
//   } catch (err) {
//     return res.status(400).json(err);
//   }
// };

export const searchMovie = async function (req: Request, res: Response) {
  try {
    const { query } = req.body;
    const movies = await MOVIES.find({
      title: { $regex: `${query}`, $options: "i" },
    }).lean();

    if (!movies || movies.length === 0) {
      const movieQuery = await TMDB.searchMovie({
        query: `${query}`,
        language: "en",
      });

      if (!movieQuery || movieQuery.results?.length === 0) {
        return res.status(400).json({ msg: "Movie not found" });
      }

      const movies = movieQuery.results as MovieResult[];
      await createEntries(movies);

      const response = await MOVIES.find({
        title: { $regex: `${query}`, $options: "i" },
      }).lean();

      if (!response || response.length === 0) {
        return res.status(400).json({ msg: "Movie not found" });
      }
      return res.status(200).json(response);
    }

    return res.status(200).json(movies);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const filterByYear = async function (req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.params;
    const movies = await MOVIES.find({
      releaseDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    if (!movies || movies.length === 0) {
      return res.status(400).json({ msg: "Movies not found" });
    }

    return res.status(200).json(movies);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const filterByGenre = async function (req: Request, res: Response) {
  try {
    const { genre } = req.body;
    const movies = await MOVIES.find({
      genres: { $in: genre },
    }).lean();

    if (!movies || movies.length === 0) {
      return res.status(400).json({ msg: "Movies not found" });
    }

    return res.status(200).json(movies);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const filterByDuration = async function (req: Request, res: Response) {
  try {
    const { duration } = req.params;
    const movies = await MOVIES.find({
      duration: { $lte: duration },
    }).lean();

    if (!movies || movies.length === 0) {
      return res.status(400).json({ msg: "Movies not found" });
    }

    return res.status(200).json(movies);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const newestFirst = async function (req: Request, res: Response) {
  try {
    const movies = await MOVIES.find().sort({ releaseDate: -1 }).lean();

    if (!movies || movies.length === 0) {
      return res.status(400).json({ msg: "Movies not found" });
    }

    return res.status(200).json(movies);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const oldestFirst = async function (req: Request, res: Response) {
  try {
    const movies = await MOVIES.find().sort({ releaseDate: 1 }).lean();

    if (!movies || movies.length === 0) {
      return res.status(400).json({ msg: "Movies not found" });
    }

    return res.status(200).json(movies);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const getMovies = async function (req: Request, res: Response) {
  try {
    const movies = await MOVIES.find().lean();

    if (!movies || movies.length === 0) {
      return res.status(400).json({ msg: "Movies not found" });
    }

    return res.status(200).json(movies);
  } catch (err) {
    return res.status(400).json(err);
  }
};
