import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Inverter from "../model/Inverter";
import Manufacturer from "../model/Manufacturer";

class InverterController {
  async review(req: Request, res: Response) {
    const repository = getRepository(Inverter);

    const inverters = await repository.find();

    return res.json(inverters);
  }

  async create(req: Request, res: Response) {
    const repository = getRepository(Inverter);
    const manufacturerRepository = getRepository(Manufacturer);

    const { model, activePower, manufacturerId } = req.body;

    const manufacturer = await manufacturerRepository.findOne(manufacturerId);

    if (!model || !activePower || !manufacturerId)
      return res.status(401).send({ message: "Preencha todos os campos" });

    if (!manufacturer)
      return res.status(401).send({ message: "Fabricante inexistente" });

    if (await repository.findOne({ where: { model } }))
      return res.status(409).send({ message: "Modelo já existente" });

    const inverter = repository.create({
      model: model.trim(),
      activePower,
      manufacturerId: manufacturerId.trim(),
      manufacturerName: manufacturer.name,
    });

    await repository.save(inverter);

    return res.json(inverter);
  }

  async delete(req: Request, res: Response) {
    const repository = getRepository(Inverter);

    const id = req.params.uuid;

    if (!(await repository.findOne(id)))
      return res.status(401).send({ message: "Fabricante inexistente" });

    await repository.delete(id);

    return res.json({ deleted: true });
  }

  async update(req: Request, res: Response) {
    const repository = getRepository(Inverter);

    const id = req.params.uuid;
    const { model, activePower } = req.body;
    const inverter = await repository.findOne(id);

    if (!inverter)
      return res.status(401).send({ message: "Fabricante inexistente" });

    if (!model || !activePower)
      return res.status(401).send({ message: "Preencha todos os campos" });

    const modelExists = await repository.findOne({ where: { model } });

    if (modelExists && modelExists.model != model)
      return res.status(409).send({ message: "Modelo já existe" });

    await repository.update(id, { model: model.trim(), activePower });
    const updatedInverter = await repository.findOne(id);

    return res.json(updatedInverter);
  }
}

export default new InverterController();
