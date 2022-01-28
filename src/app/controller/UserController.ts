import { Request, Response } from "express";
import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";

import User from "../model/User";

class UserController {
  async create(req: Request, res: Response) {
    const repository = getRepository(User);

    const { firstName, lastName, username, email, password, security_token } =
      req.body;

    if (security_token != process.env.SECURITY_TOKEN)
      return res.sendStatus(401);

    if (!firstName || !lastName || !username || !email || !password)
      return res.sendStatus(401);

    const userExists =
      (await repository.findOne({ where: { username } })) ||
      (await repository.findOne({ where: { email } }));

    if (userExists) return res.sendStatus(409);

    const user = repository.create({
      firstName,
      lastName,
      username,
      email,
      avatarUrl:
        "https://camo.githubusercontent.com/272bd51e8b58f528fb8b665699c623d32559bd121989a8449ad0c708219feb37/68747470733a2f2f312e67726176617461722e636f6d2f6176617461722f65303866333533346461636661386166643132393433313261316338393165643f643d68747470732533412532462532466769746875622e6769746875626173736574732e636f6d253246696d6167657325324667726176617461727325324667726176617461722d757365722d3432302e706e6726723d6726733d313430",
      password,
    });

    await repository.save(user);

    delete user.password;

    return res.json(user);
  }

  async getUserByJWTToken(req: Request, res: Response) {
    const repository = getRepository(User);
    let token = req.headers.authorization;

    if (token) {
      token = token.replace("Bearer", "").trim();
      const { id }: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

      const user = await repository.findOne({ where: { id } });

      if (!user) return res.send(404);

      delete user.password;

      return res.json(user);
    }
  }
}

export default new UserController();
