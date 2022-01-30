import { Router } from "express";
import AuthController from "./app/controller/AuthController";
import ManufacturersController from "./app/controller/ManufacturersController";
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

router.post("/auth", AuthController.create);

router.get("/gets3url", async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

export default router;
