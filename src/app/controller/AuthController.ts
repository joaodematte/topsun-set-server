import { Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../model/User";

class AuthController {
  async create(req: Request, res: Response) {
    const repository = getRepository(User);

    const { username, password } = req.body;

    if (!username || !password) return res.sendStatus(401);

    const user = await repository.findOne({ where: { username } });

    if (!user) return res.sendStatus(404);

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) return res.sendStatus(401);

    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      token,
    });
  }
}

export default new AuthController();
