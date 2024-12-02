import express, { NextFunction, Request, Response, Router } from "express";
import mongoose from "mongoose";
import router from "./routes";
import errorHandler from "./middleware/error-handler";

const { PORT = 3000, MONGO_URL = "mongodb://localhost:27017/mestodb" } =
  process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.locals.user = {
    _id: "674c1e34b06a6619ee23090a",
  };
  next();
});

app.use(router);

app.use(errorHandler);

const connect = async () => {
  await mongoose.connect(MONGO_URL);
  await app.listen(PORT);
};

connect();
