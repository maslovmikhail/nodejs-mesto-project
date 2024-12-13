import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  userInfo,
} from '../controllers/users';
import { validateUserBody, validateUserId } from '../middlewares/validations';

const usersRouter = Router();

usersRouter.get('/', getAllUsers);

usersRouter.patch('/me', validateUserBody, updateUserProfile);

usersRouter.patch('/me/avatar', validateUserBody, updateUserAvatar);

usersRouter.get('/me', validateUserId, userInfo);
usersRouter.get('/:userId', validateUserId, getUser);

export default usersRouter;
