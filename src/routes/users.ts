import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  userInfo,
} from '../controllers/users';
import { validateUserBody } from '../middlewares/validations';

const usersRouter = Router();

usersRouter.get('/', getAllUsers);

usersRouter.patch('/me', validateUserBody, updateUserProfile);

usersRouter.patch('/me/avatar', validateUserBody, updateUserAvatar);

usersRouter.get('/me', userInfo);
usersRouter.get('/:userId', getUser);

export default usersRouter;
