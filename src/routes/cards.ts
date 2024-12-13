import { Router } from 'express';
import {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { validateCardBody, validateCardId } from '../middlewares/validations';

const cardsRouter = Router();

cardsRouter.get('/', getAllCards);

cardsRouter.post('/', validateCardBody, createCard);

cardsRouter.delete('/:cardId', validateCardId, deleteCard);
cardsRouter.put('/:cardId/likes', validateCardId, likeCard);
cardsRouter.delete('/:cardId/likes', validateCardId, dislikeCard);

export default cardsRouter;
