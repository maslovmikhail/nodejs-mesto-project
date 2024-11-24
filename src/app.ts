import express from "express";

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.listen(PORT);
