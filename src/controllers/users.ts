import { Request, Response } from "express";
import User from "../models/user";

export const getAllUsers = (req: Request, res: Response) => {
  return User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ mesage: "Произошла ошибка" }));
};

export const getUser = (req: Request, res: Response) => {
  return User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ mesage: "Произошла ошибка" }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ mesage: "Произошла ошибка" }));
};
