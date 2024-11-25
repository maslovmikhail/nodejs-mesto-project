import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use("/users", usersRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.user = {
    _id: "6744596d95956d33c28ad363",
  };

  next();
});

app.listen(PORT, () => {
  console.log("Ссылка на сервер");
  console.log(BASE_PATH);
});
