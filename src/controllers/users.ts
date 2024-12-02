import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import NotFoundError from "../errors/not-found-error";
import { Error as MongooseError } from "mongoose";
import BadRequestError from "../errors/bad-request-error";
import { constants } from "http2";

// Возвращаем всех пользователей
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return next(error);
  }
};

// Возвращаем пользователя по _id
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError("Пользователь по указанному _id не найден")
    );
    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError("Не валидный Id пользователя"));
    }
    return next(error);
  }
};

// Создаём пользователя
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.status(constants.HTTP_STATUS_CREATED).send(await newUser.save());
  } catch (error) {
    if (error instanceof Error && error.message.includes("E11000")) {
      return next(
        new BadRequestError("Пользователь с таким именем уже существует")
      );
    }

    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при создании пользователя"
        )
      );
    }
    return next(error);
  }
};

// Обновляем профиль пользователя
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about } = req.body;
    const userProfile = await User.findByIdAndUpdate(res.locals.user._id, {
      name,
      about,
    }).orFail(
      () => new NotFoundError("Пользователь с указанным _id не найден")
    );
    return res.send(userProfile);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError("Передан недопустимый id"));
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при обновлении профиля"
        )
      );
    }
    return next(error);
  }
};

// Обновляем аватар пользователя
export const updateUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { avatar } = req.body;
    const userProfile = await User.findByIdAndUpdate(res.locals.user._id, {
      avatar,
    }).orFail(new NotFoundError("Пользователь с указанным _id не найден"));
    return res.send(userProfile);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError("Передан недопустимый id"));
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при обновлении аватара"
        )
      );
    }
    return next(error);
  }
};
