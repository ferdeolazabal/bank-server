import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

const fieldValidator = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }

  next();
};

export { fieldValidator };
