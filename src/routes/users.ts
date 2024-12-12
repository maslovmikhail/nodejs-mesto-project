import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar,
  userInfo,
} from '../controllers/users';
import { validateBody, validateObjId } from '../middlewares/validations';

const usersRouter = Router();

usersRouter.get('/', getAllUsers);

usersRouter.patch('/me', validateBody, updateUserProfile);

usersRouter.patch('/me/avatar', validateBody, updateUserAvatar);

usersRouter.get('/me', userInfo);
usersRouter.get('/:userId', validateObjId, getUser);

export default usersRouter;
