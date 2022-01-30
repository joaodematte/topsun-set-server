import { Request, Response } from "express";
import { getRepository } from "typeorm";

import Manufacturer from "../model/Manufacturer";

class ManufacturersController {
  async create(req: Request, res: Response) {
    const repository = getRepository(Manufacturer);

    const { name, productsType } = req.body;

    if (!name || productsType === null) return res.sendStatus(401);

    const upperName = name.toUpperCase();

    const manufacturerExists = await repository.findOne({
      where: { name: upperName },
    });

    if (manufacturerExists) return res.sendStatus(409);

    const manufacturer = repository.create({
      name: upperName,
      productsType,
    });

    await repository.save(manufacturer);

    return res.json(manufacturer);
  }

  async update(req: Request, res: Response) {
    const repository = getRepository(Manufacturer);

    const { name, updatedName } = req.body;

    if (!name || !updatedName) return res.sendStatus(401);

    const upperName = name.toUpperCase();
    const upperUpdatedName = updatedName.toUpperCase();

    const manufacturer = await repository.findOne({
      where: { name: upperName },
    });

    if (!manufacturer) return res.sendStatus(404);

    await repository.save({
      id: manufacturer.id,
      name: upperUpdatedName,
      productsType: manufacturer.productsType,
    });

    const updatedManufacturer = await repository.findOne({
      where: { id: manufacturer.id },
    });

    return res.json(updatedManufacturer);
  }

  async delete(req: Request, res: Response) {
    const repository = getRepository(Manufacturer);

    const { name } = req.body;

    if (!name) return res.sendStatus(401);

    const upperName = name.toUpperCase();

    const manufacturer = await repository.findOne({
      where: { name: upperName },
    });

    if (!manufacturer) return res.sendStatus(404);

    await repository.delete(manufacturer);

    return res.json({ deleted: true });
  }
}

export default new ManufacturersController();
