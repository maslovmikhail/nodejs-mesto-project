import { Router } from "express";
import { getAllUsers, getUser, createUser } from "../controllers/users";

const router = Router();

router.get("/", getAllUsers);
router.get("/:userId", getUser);
router.post("/", createUser);

export default router;
