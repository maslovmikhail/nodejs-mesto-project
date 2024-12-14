import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';

interface UserRequest extends Request {
  user?: { _id: string };
}

// Возвращаем всех пользователей
export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
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
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError('Пользователь по указанному _id не найден'),
    );
    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Не валидный Id пользователя'));
    }
    return next(error);
  }
};

// Создаём пользователя
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    const newUser = user.toObject();
    Reflect.deleteProperty(newUser, 'password');
    return res.status(constants.HTTP_STATUS_CREATED).send(newUser);
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(
        new BadRequestError('Пользователь с таким именем уже существует'),
      );
    }

    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError(
          'Переданы некорректные данные при создании пользователя',
        ),
      );
    }
    return next(error);
  }
};

// Обновляем профиль пользователя
export const updateUserProfile = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findByIdAndUpdate(req.user?._id, req.body, {
      new: true,
      runValidators: true,
    }).orFail(
      () => new NotFoundError('Пользователь с указанным _id не найден'),
    );
    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан недопустимый id'));
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении профиля',
        ),
      );
    }
    return next(error);
  }
};

// Обновляем аватар пользователя
export const updateUserAvatar = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userProfile = await User.findByIdAndUpdate(req.user?._id, req.body, {
      new: true,
      runValidators: true,
    }).orFail(new NotFoundError('Пользователь с указанным _id не найден'));
    return res.send(userProfile);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан недопустимый id'));
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении аватара',
        ),
      );
    }
    return next(error);
  }
};

// Авторизация пользователя
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    return res.send({
      token: jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      }),
    });
  } catch (_error) {
    return next(new NotFoundError('Пользователь не найден'));
  }
};

// Информация о текущем пользователе
export const userInfo = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.user?._id);
    return res.send(user);
  } catch (_error) {
    return next(new NotFoundError('Пользователь не найден'));
  }
};
