import { Router } from "express";
import { getAllCards, createCard, deleteCard } from "../controllers/cards";

const router = Router();

router.get("/", getAllCards);
router.post("/", createCard);
router.delete("/:cardId", deleteCard);

export default router;
