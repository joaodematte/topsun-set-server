import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Manufacturer from "../model/Manufacturer";
import SolarPanel from "../model/SolarPanel";

class SolarPanelController {
  async review(req: Request, res: Response) {
    const repository = getRepository(SolarPanel);

    const solarPanels = await repository.find();

    return res.json(solarPanels);
  }

  async reviewSolarPanelsFromManufacturer(req: Request, res: Response) {
    const repository = getRepository(SolarPanel);
    const manufacturerRepository = getRepository(Manufacturer);
    const id = req.params.uuid;

    const manufacturer = await manufacturerRepository.findOne(id);

    if (!manufacturer)
      return res.status(401).send({ message: "Fabricante inexistente" });

    const solarPanels = await repository.find();

    solarPanels.map((item, index) => {
      if (item.manufacturerId != manufacturer.id) {
        delete solarPanels[index];
      }
    });

    return res.json(solarPanels);
  }

  async create(req: Request, res: Response) {
    const repository = getRepository(SolarPanel);
    const manufacturerRepository = getRepository(Manufacturer);

    const { model, outputs, manufacturerId } = req.body;

    const manufacturer = await manufacturerRepository.findOne(manufacturerId);

    if (!model || !outputs || !manufacturerId)
      return res.status(401).send({ message: "Preencha todos os campos" });

    if (!manufacturer)
      return res.status(401).send({ message: "Fabricante inexistente" });

    if (await repository.findOne({ where: { model } }))
      return res.status(409).send({ message: "Modelo já existente" });

    const solarPanel = repository.create({
      model,
      outputs,
      manufacturerId,
      manufacturerName: manufacturer.name,
    });

    await repository.save(solarPanel);

    return res.json(solarPanel);
  }

  async delete(req: Request, res: Response) {
    const repository = getRepository(SolarPanel);

    const id = req.params.uuid;

    if (!(await repository.findOne(id)))
      return res.status(401).send({ message: "Fabricante inexistente" });

    await repository.delete(id);

    return res.json({ deleted: true });
  }

  async update(req: Request, res: Response) {
    const repository = getRepository(SolarPanel);

    const id = req.params.uuid;
    const { model, outputs } = req.body;
    const solarPanel = await repository.findOne(id);

    if (!solarPanel)
      return res.status(401).send({ message: "Fabricante inexistente" });

    if (!model || !outputs)
      return res.status(401).send({ message: "Preencha todos os campos" });

    const modelExists = await repository.findOne({ where: { model } });

    if (modelExists && modelExists.model != model)
      return res.status(409).send({ message: "Modelo já existe" });

    await repository.update(id, { model, outputs });
    const updatedSolarPanel = await repository.findOne(id);

    return res.json(updatedSolarPanel);
  }
}

export default new SolarPanelController();
