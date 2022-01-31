import { Request, Response } from "express";
import fs from "fs";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import path from "path";
import { getRepository } from "typeorm";
import SolarPanel from "../model/SolarPanel";
import Inverter from "../model/Inverter";
import Manufacturer from "../model/Manufacturer";

class GenerateDiagramaSimplificado {
  async create(req: Request, res: Response) {
    const repositorySolarPanel = getRepository(SolarPanel);
    const repositoryInverter = getRepository(Inverter);
    const repositoryManufacturer = getRepository(Manufacturer);

    const fixNumber = (num: number) => {
      var parts = num.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return parts.join(",");
    };

    const {
      medidor,
      capacidadeDisjuntor,
      tipoLigacao,
      quantidadeModulos,
      fabricanteModulo,
      modeloModulo,
      potenciaModulo,
      modeloInversor0,
      modeloInversor1,
    } = req.body;

    const solarPanelModelName = await repositorySolarPanel.findOne(
      modeloModulo
    );

    const inverterModelname0 = await repositoryInverter.findOne(
      modeloInversor0
    );

    let inverterModelname1;

    if (modeloInversor1) {
      inverterModelname1 = await repositoryInverter.findOne(modeloInversor1);
    }

    const manufacturerName = await repositoryManufacturer.findOne(
      fabricanteModulo
    );

    const inversor_modelo0_array = inverterModelname0.model.split("|");

    let inversor_modelo1_array;
    if (modeloInversor1) {
      inversor_modelo1_array = inverterModelname1.model.split("|");
    }

    const pdfDoc = await PDFDocument.load(
      fs.readFileSync(
        `./${
          process.env.APP_TYPE == "BUILD" ? "dist" : "src"
        }/utils/simplificado/${modeloInversor1 ? "2" : "1"}/${tipoLigacao}.pdf`
      )
    );

    pdfDoc.registerFontkit(fontkit);
    const customFont = await pdfDoc.embedFont(
      fs.readFileSync(
        `./${
          process.env.APP_TYPE == "BUILD" ? "dist" : "src"
        }/utils/fonts/calibril.ttf`
      )
    );

    const pages = pdfDoc.getPages();

    if (modeloInversor1) {
      pages[0].drawText(`${medidor.trim()}`, {
        x: 407 - customFont.widthOfTextAtSize(medidor, 15) / 2,
        y: 646,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      pages[0].drawText(`${capacidadeDisjuntor.trim()}A`, {
        x: 458,
        y: 575.5,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      pages[0].drawText(`Inversor ${inversor_modelo0_array[0].trim()}`, {
        x:
          335 -
          customFont.widthOfTextAtSize(
            `Inversor ${inversor_modelo0_array[0].trim()}`,
            15
          ) /
            2,
        y: 311,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      if (inversor_modelo0_array[1]) {
        pages[0].drawText(inversor_modelo0_array[1].trim(), {
          x:
            335 -
            customFont.widthOfTextAtSize(
              `${inversor_modelo0_array[1].trim()}`,
              15
            ) /
              2,
          y: 295,
          size: 15,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      }

      pages[0].drawText(`Inversor ${inversor_modelo1_array[0].trim()}`, {
        x:
          335 -
          customFont.widthOfTextAtSize(
            `Inversor ${inversor_modelo1_array[0].trim()}`,
            15
          ) /
            2,
        y: 170,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      if (inversor_modelo1_array[1]) {
        pages[0].drawText(inversor_modelo1_array[1].trim(), {
          x:
            335 -
            customFont.widthOfTextAtSize(
              `${inversor_modelo1_array[1].trim()}`,
              15
            ) /
              2,
          y: 154,
          size: 15,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      }

      pages[0].drawText(
        `Inversor = ${fixNumber(inverterModelname0.activePower)}W`,
        {
          x:
            825 -
            customFont.widthOfTextAtSize(
              `Inversor = ${fixNumber(inverterModelname0.activePower)}`,
              15
            ) /
              2,
          y: 180,
          size: 15,
          font: customFont,
          color: rgb(0, 0, 0),
        }
      );

      pages[0].drawText(
        `Módulos = ${fixNumber(potenciaModulo * quantidadeModulos)}Wp`,
        {
          x:
            825 -
            customFont.widthOfTextAtSize(
              `Módulos = ${fixNumber(potenciaModulo * quantidadeModulos)}`,
              15
            ) /
              2,
          y: 164,
          size: 15,
          font: customFont,
          color: rgb(0, 0, 0),
        }
      );

      pages[0].drawText(`Módulo ${manufacturerName.name.trim()}`, {
        x:
          360 -
          customFont.widthOfTextAtSize(
            `Módulo ${manufacturerName.name.trim()}`,
            15
          ) /
            2,
        y: 110,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      pages[0].drawText(`${solarPanelModelName.model.trim()}`, {
        x:
          360 -
          customFont.widthOfTextAtSize(
            `${solarPanelModelName.model.trim()}`,
            15
          ) /
            2,
        y: 94,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      pages[0].drawText(`${quantidadeModulos} x ${potenciaModulo}Wp`, {
        x:
          360 -
          customFont.widthOfTextAtSize(
            `${quantidadeModulos} x ${potenciaModulo}Wp`,
            15
          ) /
            2,
        y: 78,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });
    } else {
      pages[0].drawText(`${medidor.trim()}`, {
        x: 400 - customFont.widthOfTextAtSize(medidor, 15) / 2,
        y: 605,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      pages[0].drawText(`${capacidadeDisjuntor.trim()}A`, {
        x: 450,
        y: 534,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      pages[0].drawText(`Inversor ${inversor_modelo0_array[0].trim()}`, {
        x:
          335 -
          customFont.widthOfTextAtSize(
            `Inversor ${inversor_modelo0_array[0].trim()}`,
            15
          ) /
            2,
        y: 268,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      if (inversor_modelo0_array[1]) {
        pages[0].drawText(inversor_modelo0_array[1].trim(), {
          x:
            335 -
            customFont.widthOfTextAtSize(
              `${inversor_modelo0_array[1].trim()}`,
              15
            ) /
              2,
          y: 252,
          size: 15,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      }

      pages[0].drawText(
        `Inversor = ${fixNumber(inverterModelname0.activePower)}W`,
        {
          x:
            675 -
            customFont.widthOfTextAtSize(
              `Inversor = ${fixNumber(inverterModelname0.activePower)}`,
              15
            ) /
              2,
          y: 136,
          size: 15,
          font: customFont,
          color: rgb(0, 0, 0),
        }
      );

      pages[0].drawText(
        `Módulos = ${fixNumber(potenciaModulo * quantidadeModulos)}Wp`,
        {
          x:
            675 -
            customFont.widthOfTextAtSize(
              `Módulos = ${fixNumber(potenciaModulo * quantidadeModulos)}`,
              15
            ) /
              2,
          y: 120,
          size: 15,
          font: customFont,
          color: rgb(0, 0, 0),
        }
      );

      pages[0].drawText(`Módulo ${manufacturerName.name.trim()}`, {
        x:
          335 -
          customFont.widthOfTextAtSize(
            `Módulo ${manufacturerName.name.trim()}`,
            15
          ) /
            2,
        y: 160,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      pages[0].drawText(`${solarPanelModelName.model.trim()}`, {
        x:
          335 -
          customFont.widthOfTextAtSize(
            `${solarPanelModelName.model.trim()}`,
            15
          ) /
            2,
        y: 144,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      pages[0].drawText(`${quantidadeModulos} x ${potenciaModulo}Wp`, {
        x:
          335 -
          customFont.widthOfTextAtSize(
            `${quantidadeModulos} x ${potenciaModulo}Wp`,
            15
          ) /
            2,
        y: 128,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      });
    }

    fs.writeFileSync(
      `./${
        process.env.APP_TYPE == "BUILD" ? "dist" : "src"
      }/utils/simplificado/generated.pdf`,
      await pdfDoc.save()
    );

    return res.sendStatus(200);
  }

  async downloadPdf(req: Request, res: Response) {
    const file = path.join(__dirname, "../../utils/simplificado/generated.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.download(file);
  }
}

export default new GenerateDiagramaSimplificado();
