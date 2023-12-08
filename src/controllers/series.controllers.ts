import { Request, Response, NextFunction } from "express";
import SERIES, { ISerie } from "../models/series";
import { TvResult, MovieDb } from "moviedb-promise";

const TMDB = new MovieDb(`${process.env.APIKEY}`);

const createEntries = async function (series: TvResult[]) {
  for (const tv of series) {
    const tvInfo = await TMDB.tvInfo({
      id: `${tv.id}`,
      language: "en",
    });

    if (
      !tvInfo.first_air_date ||
      !tvInfo.overview ||
      (tvInfo.original_language !== "en" && tvInfo.original_language !== "es")
    ) {
      continue;
    }

    const seasons = tvInfo.seasons
      ?.filter((season: any) => season.air_date !== null)
      .map((season: any) => ({
        number: season.season_number,
        name: season.name,
        episodes: season.episode_count,
        airdate: season.air_date,
      }));

    // console.log(seasons);

    const entry = new SERIES({
      title: tvInfo.name,
      posterURL: `https://image.tmdb.org/t/p/w500${tvInfo.poster_path}`,
      genres: tvInfo.genres?.map((genre: any) => genre.name),
      overview: tvInfo.overview,
      firstAirDate: tvInfo.first_air_date,
      lastAirDate: tvInfo.last_air_date,
      trailerURL: ``,
      seasons: seasons,
    });

    const videos = await TMDB.tvVideos({
      id: `${tv.id}`,
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

export const searchSerie = async function (req: Request, res: Response) {
  try {
    const { query } = req.body;
    const series = await SERIES.find({
      title: { $regex: `${query}`, $options: "i" },
    }).lean();

    if (!series || series.length === 0) {
      const serieQuery = await TMDB.searchTv({
        query: `${query}`,
        language: "en",
      });

      if (!serieQuery || serieQuery.results?.length === 0) {
        return res.status(400).json({ msg: "Movie not found" });
      }

      const series = serieQuery.results as TvResult[];
      await createEntries(series);

      const response = await SERIES.find({
        title: { $regex: `${query}`, $options: "i" },
      }).lean();

      if (!response || response.length === 0) {
        return res.status(400).json({ msg: "Movie not found" });
      }
      return res.status(200).json(response);
    }

    return res.status(200).json(series);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const getSeries = async function (req: Request, res: Response) {
  try {
    const series = await SERIES.find().lean();

    if (!series || series.length === 0) {
      return res.status(400).json({ msg: "Series not found" });
    }

    return res.status(200).json(series);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const filterByYear = async function (req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.params;
    const series = await SERIES.find({
      firstAirDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    if (!series || series.length === 0) {
      return res.status(400).json({ msg: "Series not found" });
    }

    return res.status(200).json(series);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const filterByGenre = async function (req: Request, res: Response) {
  try {
    const { genre } = req.body;
    const series = await SERIES.find({
      genres: { $in: genre },
    }).lean();

    if (!series || series.length === 0) {
      return res.status(400).json({ msg: "Movies not found" });
    }

    return res.status(200).json(series);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const newestFirst = async function (req: Request, res: Response) {
  try {
    const series = await SERIES.find().sort({ firstAirDate: -1 }).lean();

    if (!series || series.length === 0) {
      return res.status(400).json({ msg: "Movies not found" });
    }

    return res.status(200).json(series);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const oldestFirst = async function (req: Request, res: Response) {
  try {
    const series = await SERIES.find().sort({ firstAirDate: 1 }).lean();

    if (!series || series.length === 0) {
      return res.status(400).json({ msg: "Movies not found" });
    }

    return res.status(200).json(series);
  } catch (err) {
    return res.status(400).json(err);
  }
};
