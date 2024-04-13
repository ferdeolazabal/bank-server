import { AppDataSource } from "../data-source";
import { Response, Request } from "express";

import User from "../domain/User";

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await AppDataSource.manager.find(User);

    res.json({
      ok: true,
      users,
    });
  } catch (e) {
    console.log({ e });
    res.status(500).json({
      ok: false,
      message: "Error al obtener los usuarios registrados",
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await AppDataSource.manager.findOne(User, {
      where: { _id: id },
    });

    res.json({
      ok: true,
      user,
    });
  } catch (e) {
    console.log({ e });
    res.status(500).json({
      ok: false,
      message: "Error al obtener usuario",
    });
  }
};

export { getUsers, getUser };
