import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source";
import { generateJWT } from "../helpers/jwt";

import User from "../domain/User";

const createUser = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const existeEmail = await AppDataSource.manager.findOne(User, {
      where: { email: body.email },
    });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        message: `El email ${body.email} ya está registrado`,
      });
    }

    const user = new User();

    const salt = bcrypt.genSaltSync();

    const { firstName, lastName, email } = body;

    user.setValues({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(body.password, salt),
      enable: true,
      isSuperAdmin: false,
    });

    const newUser = await AppDataSource.manager.save(user);

    const token = await generateJWT(newUser.getId(), newUser.getFullName());

    const userResponse = {
      id: newUser.getId(),
      firstName: newUser.getFirstName(),
      lastName: newUser.getLastName(),
      enable: newUser.getEnable(),
      email: newUser.getEmail(),
      isSuperAdmin: newUser.getIsSuperAdmin(),
      createdAt: newUser.getCreatedAt(),
      updatedAt: newUser.getUpdatedAt(),
    };

    res.json({
      ok: true,
      user: userResponse,
      token,
    });
  } catch (e) {
    console.log({ e });
    res.status(500).json({
      ok: false,
      message: "Error al guardar el usuario",
    });
  }
};

const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const findUser = await AppDataSource.manager.findOne(User, {
      where: { email },
    });

    if (!findUser) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    const user = User.fromValues(findUser);

    const checkValidPassword = bcrypt.compareSync(password, user.password);

    if (!checkValidPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    const token = await generateJWT(user.getId(), user.getFullName());

    const userResponse = {
      id: user.getId(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      enable: user.getEnable(),
      email: user.getEmail(),
      isSuperAdmin: user.getIsSuperAdmin(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };

    res.json({
      ok: true,
      uid: user.getId(),
      name: user.getFullName(),
      user: userResponse,
      token,
    });
  } catch (e) {
    console.log({ e });
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const revalidateToken = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  try {
    const token = await generateJWT(id, name);

    const user = await AppDataSource.manager.findOne(User, {
      where: { _id: id },
    });

    const userResponse = {
      id: user.getId(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      enable: user.getEnable(),
      email: user.getEmail(),
      isSuperAdmin: user.getIsSuperAdmin(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };

    res.json({
      ok: true,
      token,
      id,
      user: userResponse,
    });
  } catch (e) {
    console.log("Error al revalidar el token", { e });
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

export { userLogin, revalidateToken, createUser };
