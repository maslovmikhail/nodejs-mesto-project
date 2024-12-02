import { NextFunction, Request, Response } from "express";
import Card from "../models/card";
import { constants } from "http2";
import BadRequestError from "../errors/bad-request-error";
import { Error as MongooseError } from "mongoose";

// Возвращаем все карточки
export const getAllCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return next(error);
  }
};

// Создаём карточку
export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, link, owner } = req.body;
    const newCard = await Card.create({ name, link, owner });
    return res.status(constants.HTTP_STATUS_CREATED).send(await newCard.save());
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при создании карточки"
        )
      );
    }
    return next(error);
  }
};

// Удаляем карточку по идентификатору
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    return res.send(card);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError("Карточка с указанным _id не найдена"));
    }
    return next(error);
  }
};

// Добавляем лайк карточке
export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: res.locals.user._id } },
      { new: true }
    );
    return res.send(card);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError("Переданы некорректные данные для постановки лайка")
      );
    }
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError("Передан несуществующий _id карточки"));
    }
    next(error);
  }
};

// Удаляем лайк с карточки
export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: res.locals.user._id } },
      { new: true }
    );
    return res.send(card);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError("Переданы некорректные данные для снятии лайка")
      );
    }
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError("Передан несуществующий _id карточки"));
    }
    next(error);
  }
};
