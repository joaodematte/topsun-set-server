import { Router } from "express";
import AuthController from "./app/controller/AuthController";
import GenerateDiagramaSimplificado from "./app/controller/GenerateDiagramaSimplificado";
import InverterController from "./app/controller/InverterController";
import ManufacturersController from "./app/controller/ManufacturersController";
import SolarPanelController from "./app/controller/SolarPanelController";
import { generateUploadURL } from "./app/controller/UploadImageController";
import UserController from "./app/controller/UserController";
import authMiddleware from "./app/middleware/authMiddleware";

const router = Router();

router.post("/users", UserController.create);
router.post("/users/update", authMiddleware, UserController.update);
router.get("/users/me", authMiddleware, UserController.getUserByJWTToken);

router.post("/manufacturers", authMiddleware, ManufacturersController.create);
router.post(
  "/manufacturers/update",
  authMiddleware,
  ManufacturersController.update
);
router.delete("/manufacturers", authMiddleware, ManufacturersController.delete);
router.get("/manufacturers", authMiddleware, ManufacturersController.review);
router.get(
  "/manufacturers/:uuid",
  authMiddleware,
  ManufacturersController.reviewSpecific
);

router.post("/auth", AuthController.create);

router.get("/gets3url", async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

router.get("/solarpanels", authMiddleware, SolarPanelController.review);
router.get(
  "/solarpanels/:uuid",
  authMiddleware,
  SolarPanelController.reviewSolarPanelsFromManufacturer
);
router.post("/solarpanels", authMiddleware, SolarPanelController.create);
router.delete(
  "/solarpanels/:uuid",
  authMiddleware,
  SolarPanelController.delete
);
router.post("/solarpanels/:uuid", authMiddleware, SolarPanelController.update);

router.get("/inverters", authMiddleware, InverterController.review);
router.delete("/inverters/:uuid", authMiddleware, InverterController.delete);
router.post("/inverters", authMiddleware, InverterController.create);
router.post("/inverters/:uuid", authMiddleware, InverterController.update);

router.post(
  "/gerador/simplificado",
  authMiddleware,
  GenerateDiagramaSimplificado.create
);

router.get(
  "/gerador/simplificado",
  authMiddleware,
  GenerateDiagramaSimplificado.downloadPdf
);

export default router;
