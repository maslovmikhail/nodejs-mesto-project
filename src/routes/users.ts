import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/", getAllUsers);
usersRouter.post("/", createUser);
usersRouter.patch("/me", updateUserProfile);
usersRouter.patch("/me/avatar", updateUserAvatar);
usersRouter.get("/:userId", getUser);

export default usersRouter;
