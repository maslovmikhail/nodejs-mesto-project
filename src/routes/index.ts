import { Router } from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import { createUser, login } from '../controllers/users';
import { validateUser } from '../middlewares/validations';
// import auth from '../middlewares/auth';

const router = Router();

router.post('/signin', validateUser, login);
router.post('/signup', validateUser, createUser);

// router.use(auth); // Защитита API авторизацией

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

export default router;
