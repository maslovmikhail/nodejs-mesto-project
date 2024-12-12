import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import Card from '../models/card';
import BadRequestError from '../errors/bad-request-error';

// Возвращаем все карточки
export const getAllCards = async (
  _req: Request,
  res: Response,
  next: NextFunction,
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
  next: NextFunction,
) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.body.user._id });
    return res.status(constants.HTTP_STATUS_CREATED).send(await newCard.save());
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError(
          'Переданы некорректные данные при создании карточки',
        ),
      );
    }
    return next(error);
  }
};

// Удаляем карточку по идентификатору
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    return res.send(card);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Карточка с указанным _id не найдена'));
    }
    return next(error);
  }
};

// Добавляем лайк карточке
export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: res.locals.user._id } },
      { new: true },
    );
    return res.send(card);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError(
          'Переданы некорректные данные для постановки лайка',
        ),
      );
    }
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан несуществующий _id карточки'));
    }
    return next(error);
  }
};

// Удаляем лайк с карточки
export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: res.locals.user._id } },
      { new: true },
    );
    return res.send(card);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError('Переданы некорректные данные для снятии лайка'),
      );
    }
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан несуществующий _id карточки'));
    }
    return next(error);
  }
};
