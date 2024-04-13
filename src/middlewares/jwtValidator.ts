import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtValidator = (req: Request, res: Response, next: NextFunction) => {
  // x-token headers
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }

  try {
    jwt.verify(token, process.env.SECRET_JWT_SEED);
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }

  next();
};

export { jwtValidator };
