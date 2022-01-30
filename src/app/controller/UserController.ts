import { Request, Response } from "express";
import { getRepository } from "typeorm";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../model/User";

class UserController {
  async create(req: Request, res: Response) {
    const repository = getRepository(User);

    const {
      fullName,
      username,
      email,
      password,
      password_confirm,
      security_token,
    } = req.body;

    if (
      !fullName ||
      !username ||
      !email ||
      !password ||
      !security_token ||
      !password_confirm
    )
      return res.status(401).send({ message: "Preencha todos os campos" });

    if (security_token != process.env.SECURITY_TOKEN)
      return res.status(401).send({ message: "Token de segurança inválido" });

    if (password !== password_confirm)
      return res.status(401).send({ message: "As senhas não conferem" });

    const userExists =
      (await repository.findOne({ where: { username } })) ||
      (await repository.findOne({ where: { email } }));

    if (userExists)
      return res
        .status(409)
        .send({ message: "Usuário ou email já cadastrado" });

    const user = repository.create({
      fullName,
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

  async update(req: Request, res: Response) {
    const repository = getRepository(User);
    let token = req.headers.authorization;

    const { fullName, username, email, avatarUrl } = req.body;

    if (!fullName || !username || !email || !avatarUrl)
      return res.status(401).send({ message: "Preencha todos os campos" });

    token = token.replace("Bearer", "").trim();
    const { id }: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    const user = await repository.findOne({ where: { id } });

    if (!user) return res.status(404).send({ message: "Usuário inexistente" });

    await repository.update({ id }, { fullName, username, email, avatarUrl });

    const updatedUser = await repository.findOne({ where: { id } });

    delete updatedUser.id;
    delete updatedUser.password;

    return res.json(updatedUser);
  }

  async getUserByJWTToken(req: Request, res: Response) {
    const repository = getRepository(User);
    let token = req.headers.authorization;

    token = token.replace("Bearer", "").trim();
    const { id }: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    const user = await repository.findOne({ where: { id } });

    if (!user) return res.status(404).send({ message: "Usuário inexistente" });

    delete user.password;

    return res.json(user);
  }
}

export default new UserController();
