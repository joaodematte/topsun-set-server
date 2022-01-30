import { Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../model/User";

class AuthController {
  async create(req: Request, res: Response) {
    const repository = getRepository(User);

    const { username, password } = req.body;

    if (!username || !password)
      return res.status(401).send({ message: "Preencha todos os campos" });

    const user = await repository.findOne({ where: { username } });

    if (!user)
      return res.status(401).send({ message: "Usuário não encontrado" });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(401).send({ message: "Senha inválida" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      fullName: user.fullName,
      username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token,
    });
  }
}

export default new AuthController();
