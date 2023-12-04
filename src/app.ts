import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import passport from "passport";
import passportMiddleWare from "./middlewares/passport";

import userRoutes from "./routes/user.routes";
import movieRoutes from "./routes/movie.routes";

// Init
const app = express();

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

passport.use(passportMiddleWare);

// Routes
app.use(userRoutes);
app.use(movieRoutes);

// Start
app.get("/", function (req: express.Request, res: express.Response) {
  res.send(`You should not be here`);
});

export default app;
