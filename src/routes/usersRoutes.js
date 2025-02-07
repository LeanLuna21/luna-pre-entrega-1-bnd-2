import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/usersController.js";

const userRouter = Router()

userRouter.get('/', getUsers)
userRouter.get('/:uid', getUser)
userRouter.post('/', createUser)
userRouter.put('/:uid', updateUser)
userRouter.delete('/:uid', deleteUser)

export default userRouter