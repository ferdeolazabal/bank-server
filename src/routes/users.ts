import { Router } from "express";

import { getUsers, getUser } from "../controllers/users";

const usersRoutes = Router();

usersRoutes.get("/", getUsers);

usersRoutes.get("/:id", getUser);

export default usersRoutes;
