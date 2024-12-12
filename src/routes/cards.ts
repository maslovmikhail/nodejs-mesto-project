import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { urlRegExp, validateObjId } from '../middlewares/validations';

const cardsRouter = Router();

cardsRouter.get('/', getAllCards);

cardsRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .pattern(urlRegExp)
        .message('Поле "name" должно быть валидным url-адресом')
        .messages({
          'string.empty': 'Поле "link" должно быть заполнено',
        }),
    }),
  }),
  createCard,
);

cardsRouter.delete('/:cardId', validateObjId, deleteCard);
cardsRouter.put('/:cardId/likes', validateObjId, likeCard);
cardsRouter.delete('/:cardId/likes', validateObjId, dislikeCard);

export default cardsRouter;
