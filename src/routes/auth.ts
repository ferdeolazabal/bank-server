import { Router } from "express";
import { check } from "express-validator";
import { fieldValidator } from "../middlewares/fieldValidator";
import { jwtValidator } from "../middlewares/jwtValidator";

import { createUser, revalidateToken, userLogin } from "../controllers/auth";

const authRoutes = Router();

authRoutes.post(
  "/newUser",
  [
    check("firstName", "El nombre es obligatorio").not().isEmpty(),
    check("lastName", "El apellido es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    fieldValidator,
  ],
  createUser
);

authRoutes.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    fieldValidator,
  ],
  userLogin
);

authRoutes.get("/renew", jwtValidator, revalidateToken);

export default authRoutes;
